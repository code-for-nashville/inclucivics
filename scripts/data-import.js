#!/usr/bin/env node
const countBy = require('lodash.countby')
const fromPairs = require('lodash.fromPairs')
const groupBy = require('lodash.groupby')
const mapValues = require('lodash.mapvalues')
const fecha = require('fecha')
const {csvParse, csvFormat} = require('d3-dsv')
const fs = require('fs')
const pkg = require('../package.json')
const program = require('commander')
const constants = require('../src/constants.js')

const DEPARTMENT_NAMES_TO_IDS = {}
const DEPARTMENT_IDS_TO_NAMES = {}
let departmentId = 0

program
    .version(pkg.version)
    .usage('[options]')
    .option('-d, --date [date]', 'The date of the input data to import in YYYYMMDD format, e.g. 20170401')
    .parse(process.argv)

if (program.date) {
  console.log(`Importing input data from ${program.date}`)
  generateReport(program.date)
} else {
  console.log('Generating aggregate reports')
  generateSummaries()
}

function employeesForDate (date) {
  const blob = fs.readFileSync(`input/${date}.csv`, 'utf8')
  const lines = csvParse(blob)
  return lines.map(employeeFromCSVLine)
}

function generateSummaries () {
  // Generate an overall summary for each salary bucket per year
  const filenames = fs.readdirSync('./input')
  const employeesByDate = fromPairs(filenames.map(f => {
    // Remove trailing '.csv'
    const dateString = f.replace('.csv', '')
    return [fecha.parse(dateString, 'YYYYMMDD'), employeesForDate(dateString)]
  }))

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
          date: fecha.format(Date.parse(dateString), 'YYYY-MM-DD'),
          salaryBucketId: bucket,
          ethnicityId,
          percent: ethnicityTotal / (salaryBucketTotals[dateString][bucket] || 1)
        }
      })
      summaries.push(...ethnicitySummaries)
    })
  }

  fs.writeFileSync('./public/data/summaries.json', JSON.stringify(summaries))
}

function generateReport (date) {
  const employees = employeesForDate(date)
  const dateDirectory = `public/data`
  if (!fs.existsSync(dateDirectory)) {
    fs.mkdirSync(dateDirectory)
  }

  fs.writeFileSync(`${dateDirectory}/employees.csv`, csvFormat(employees))

  fs.writeFileSync(
        `${dateDirectory}/departments.json`,
        JSON.stringify(DEPARTMENT_IDS_TO_NAMES)
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
