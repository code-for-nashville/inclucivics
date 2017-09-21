#!/usr/bin/env node
const countBy = require('lodash.countby')
const groupBy = require('lodash.groupby')
const mapValues = require('lodash.mapvalues')
const {csvParse, csvFormat} = require('d3-dsv')
const fs = require('fs')

const DEPARTMENT_NAMES_TO_IDS = {}
const DEPARTMENT_IDS_TO_NAMES = {}
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
const ETHNICITY_LABELS = Object.values(ETHNICITY_ID_LABELS)

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

console.log('Creating a processed file for each date, and a summary file for all date')
main()

/*
  For each file in input, generate a list of departments and processed data
  suitable for the Explore page

  Also generate a summary file of all input files
*/
function main () {
  // Generate an overall summary for each salary bucket per year
  const filenames = fs.readdirSync('./input')

  const employeesByDate = {}

  filenames.forEach(f => {
    // YYYYMMDD format
    let date = f.replace('.csv', '')
    // Since we end up sending this to the frontend, make it parseable upfront
    date = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`

    const dateDirectory = `public/data/${date}`
    if (!fs.existsSync(dateDirectory)) {
      fs.mkdirSync(dateDirectory)
    }
    const blob = fs.readFileSync(`input/${f}`, 'utf8')
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

  fs.writeFileSync(
    './public/data/summaries.json',
    JSON.stringify(summaries)
  )

  fs.writeFileSync(
    `public/data/departments.json`,
    JSON.stringify(DEPARTMENT_IDS_TO_NAMES)
  )

  fs.writeFileSync(
    './public/data/dates.json',
    JSON.stringify(Object.keys(employeesByDate))
  )
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

salary - String - a dollar amount with thousands separators and dollar sing
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
