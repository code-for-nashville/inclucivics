#!/usr/bin/env node
const countBy = require('lodash.countby')
const groupBy = require('lodash.groupby')
const mapValues = require('lodash.mapvalues')
const {csvParse, csvFormat} = require('d3-dsv')
const fs = require('fs')
const constants = require('../src/constants.js')

const DEPARTMENT_NAMES_TO_IDS = {}
const DEPARTMENT_IDS_TO_NAMES = {}
let departmentId = 0

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
  // store the regex to find either Dept or Department in the keys of the
  // employee object that's passed in to this function (i flag allows regex to ignore case)
  const dept_regex = /DEPT|DEPARTMENT/gi

  // filter through the keys of the employee object to find the column
  // that contains the name of the department
  // the first filter clause finds all of the column titles that contain DEPT or DEPARTMENT
  // the second filter clause checks the contents of the each column found to determine
  // if the column contains letter and not just numbers.  In some of the older
  // files, there are two department columns, one with a number, and one with the name
  // for this purpose we just want the name of the department
  let department_name = employee[Object.keys(employee)
                                .filter(k => k.match(dept_regex) != null)
                                .filter(l => employee[l].match(/[a-z]+/gi) != null)]

  return {
    ethnicityId: parseInt(employee['Ethnic Code']),
    salaryBucketId,
    departmentId: getDepartmentId(department_name),
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
