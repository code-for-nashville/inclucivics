#!/usr/bin/env node
const aws = require('aws-sdk');
const countBy = require('lodash.countby')
const groupBy = require('lodash.groupby')
const mapValues = require('lodash.mapvalues')
const {csvParse, csvFormat} = require('d3-dsv')
const fetch = require('node-fetch')
const fs = require('fs')
const s3 = new aws.S3()

const DATA_URL = 'http://data.nashville.gov/api/views/4ibi-mxs4'
const DEPARTMENT_NAMES_TO_IDS = {}
const DEPARTMENT_IDS_TO_NAMES = {}
const S3_BUCKET = 'codefornashville-inclucivics-c9b520'
let departmentId = 0

// these constants need to accessed separately as global resource (front-end too)
const LOW = 0
const MID = 1
const HIGH = 2
const SALARY_BUCKETS = [HIGH, MID, LOW]
const SALARY_BUCKET_LABELS = {
  [LOW]: 'Lower Income Range (Less than $33,000)',
  [MID]: 'Middle Income Range ($33,000 and $66,000)',
  [HIGH]: 'Upper Income Range (Greater than $66,000)'
}

const ETHNICITY_ATTRIBUTE = 'ethnicity'
const ETHNICITY_IDS = [
  30,
  31,
  99,
  2,
  1,
  3,
  4,
  5
]
const ETHNICITY_ID_LABELS = {
  30: 'Hawaiian or Pacific Islander',
  31: 'Two or More Races',
  99: 'Unknown',
  2: 'Black',
  1: 'White (Not of Hispanic Origin)',
  3: 'Hispanic',
  4: 'Asian or Pacific Islander',
  5: 'American Indian/Alaskan Native'
}
const ETHNICITY_LABELS = Object.keys(ETHNICITY_ID_LABELS).map(label => (ETHNICITY_ID_LABELS[label]))

const GENDER_ATTRIBUTE = 'gender'
const GENDERS = ['M', 'F']

const ATTRIBUTE_TO_CHOICES = {
  [ETHNICITY_ATTRIBUTE]: ETHNICITY_LABELS,
  [GENDER_ATTRIBUTE]: GENDERS
}

const constants = {
  LOW,
  MID,
  HIGH,
  SALARY_BUCKETS,
  SALARY_BUCKET_LABELS,
  ETHNICITY_ATTRIBUTE,
  ETHNICITY_IDS,
  ETHNICITY_ID_LABELS,
  ETHNICITY_LABELS,
  GENDER_ATTRIBUTE,
  GENDERS,
  ATTRIBUTE_TO_CHOICES
}

/*
  For each file in input, generate a list of departments and processed data
  suitable for the Explore page

  Also generate a summary file of all input files
*/
exports.handler = function main (event, context, callback) {
  // Copy s3 to local tmp directory
  var params = {
    Bucket: S3_BUCKET,
    MaxKeys: 1000,
    Prefix: 'input/'
  };

  fetchPublishedData()
    .then(() => s3.listObjects(params).promise())
    .then(copyEach)
    .then(processFiles)
    .then(() => callback(null, 'Yay'))
    .catch(callback)
}

function copyEach(s3ObjectList) {
  //lambda may be borrowing a previous container, so don't know if these exist
  if (!fs.existsSync(`/tmp/input/`)) {
    fs.mkdirSync(`/tmp/input/`)
  }
  const promises = s3ObjectList['Contents'].map(metadata => {
    var params = {
      Bucket: S3_BUCKET,
      Key: metadata.Key
    };
    return s3.getObject(params).promise()
      .then(data => {
        fs.writeFileSync(`/tmp/${metadata.Key}`, data.Body);
      })
  });
  return Promise.all(promises)
}

function processFiles() {
  // Generate an overall summary for each salary bucket per year
  const filenames = fs.readdirSync('/tmp/input/')

  const employeesByDate = {}

  //lambda may be borrowing a previous container, so don't know if these exist
  if (!fs.existsSync(`/tmp/public/`)) {
    fs.mkdirSync(`/tmp/public/`)
  }
  if (!fs.existsSync(`/tmp/public/data/`)) {
    fs.mkdirSync(`/tmp/public/data/`)
  }

  filenames.forEach(f => {
    // YYYYMMDD format
    let date = f.replace('.csv', '')
    // Since we end up sending this to the frontend, make it parseable upfront
    date = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`

    const dateDirectory = `/tmp/public/data/${date}`
    if (!fs.existsSync(dateDirectory)) {
      fs.mkdirSync(dateDirectory)
    }
    const blob = fs.readFileSync(`/tmp/input/${f}`, 'utf8')
    const lines = csvParse(blob)
    const employees = lines.map(employeeFromCSVLine)
    fs.writeFileSync(`${dateDirectory}/employees.csv`, csvFormat(employees))

    employeesByDate[date] = employees
  })

  const salaryBucketTotals = mapValues(employeesByDate, employees => {
    return countBy(employees, e => e.salaryBucketId)
  })

  // Return an array of [{date, incomeBucketId, ethnicityId, percent}] objects
  const summaries = []
  // Date is converted to a string when used as an object key
  for (let dateString in employeesByDate) {
    const bySalaryBucket = groupBy(employeesByDate[dateString], e => e.salaryBucketId)
    constants.SALARY_BUCKETS.forEach(bucket => {
      const ethnicityTotals = countBy(bySalaryBucket[bucket] || [], e => e.ethnicityId)
      const ethnicitySummaries = constants.ETHNICITY_IDS.map(ethnicityId => {
        const ethnicityTotal = ethnicityTotals[ethnicityId] || 0
        return {
          date: dateString,
          salaryBucketId: bucket,
          ethnicityId,
          percent: ethnicityTotal / (salaryBucketTotals[dateString][bucket] || 1)
        }
      })
      summaries.push(...ethnicitySummaries)
    })
  }

  const putObjectParams = [
    [summaries, 'summaries.json'],
    [DEPARTMENT_IDS_TO_NAMES, 'departments.json'],
    [Object.keys(employeesByDate), 'dates.json']
  ]

  const putObjectPromises = putObjectParams.map(([data, filename]) => {
    var params = {
      Body: JSON.stringify(data),
      Bucket: S3_BUCKET,
      Key: `public/data/${filename}`,
      ACL: `public-read`
    };
    s3.putObject(params).promise()
  })
  return Promise.all(putObjectPromises)
}

function employeeFromCSVLine (employee) {
  const salary = parseSalary(employee['Annual Salary'])
  const salaryBucketId = bucketSalary(salary)

  return {
    ethnicityId: parseInt(employee['Ethnic Code']),
    salaryBucketId,
    departmentId: getDepartmentId(employee['Current Dept Description'] || employee['Department']),
    gender: employee['Gender']
  }
}

/*
    Generate a dynamic list of codes to departments, returnin the ID of the
    passed in department.

    We can save this and use it for efficient lookups on the client side.
*/
function getDepartmentId (department) {
  if (!DEPARTMENT_NAMES_TO_IDS[department]) {
    DEPARTMENT_NAMES_TO_IDS[department] = departmentId
    DEPARTMENT_IDS_TO_NAMES[departmentId] = department
    departmentId += 1
  }

  return DEPARTMENT_NAMES_TO_IDS[department]
}

function bucketSalary (salary) {
  if (salary < 33000) return constants.LOW
  if (salary < 66000) return constants.MID
  return constants.HIGH
}

/*
Internal method to parse the income string we get back from reports into a float

Some seasonal employees have "Annual Salary" listed as an empty string, and
some records in 20150301.csv just have '$-  ' listed as a salary. Allow these
to raise an exception.

salary - String - a dollar amount with thousands separators and dollar sign
    e.g. '$1,324.00'. May also be just '$-'
*/
function parseSalary (salary) {
  try {
    const cleaned = salary.replace(',', '').replace('$', '')
    return parseFloat(cleaned)
  } catch (ex) {
    console.warn(`Exception ${ex}`)
    return 0
  }
}

/**
 * HTTP requests for latest published General Government Employees Demographics dataset.
 */
function fetchPublishedData () {
  var filename;
  return fetch(DATA_URL)
    .then(resp => resp.json())
    .then(data => {
      const rowsUpdatedAt = new Date(data['rowsUpdatedAt'] * 1000)
      filename = rowsUpdatedAt.toISOString().replace(/-/g, '').slice(0, 8)
      return fetch(`${DATA_URL}/rows.csv`)
    })
    .then(resp => resp.text())
    .then(body => {
      const params = {
        Bucket: S3_BUCKET,
        Key: `input/${filename}`,
        Body: body,
        ACL: 'public-read'
      }
      s3.upload(params, console.log)
    })
}
