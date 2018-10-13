import React, { PureComponent } from 'react'
import Select from 'react-select'
import { csvParse } from 'd3-dsv'

import {
  ETHNICITY_ATTRIBUTE,
  ETHNICITY_ID_LABELS,
  GENDER_ATTRIBUTE
} from './constants.js'
import IncomeLevelPieCharts from './IncomeLevelPieCharts.js'

import 'react-select/dist/react-select.css'
import './ExploreCharts.css'

export default class ExploreCharts extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      departments: [],
      departmentId: null,
      attribute: ETHNICITY_ATTRIBUTE,
      dates: [],
      date: null
    }

    this.setDepartmentId = this.setDepartmentId.bind(this)
    this.setAttribute = this.setAttribute.bind(this)
    this.setDate = this.setDate.bind(this)
  }

  fetchDepartments () {
    return window.fetch('./data/departments.json')
      .then(res => res.json())
  }

  fetchEmployees (date) {
    return window.fetch(
      `./data/${date}/employees.csv`
    ).then(
      res => res.text()
    ).then(text => {
      const employees = csvParse(text)
      employees.forEach(employee => {
        employee.ethnicity = ETHNICITY_ID_LABELS[employee.ethnicityId]
      })
      return employees
    })
  }

  fetchDates () {
    return window.fetch(`./data/dates.json`)
    .then(res => res.json())
  }

  componentDidMount () {
    const datesPromise = this.fetchDates()
    const employeesPromise = datesPromise.then(dates => {
      const latestDate = dates[dates.length - 1]
      return this.fetchEmployees(latestDate)
    })
    const departmentsPromise = this.fetchDepartments()

    Promise.all(
      [datesPromise, departmentsPromise, employeesPromise]
    ).then(results => {
      const [dates, departments, employees] = results
      this.setState({
        dates: dates,
        date: dates[dates.length - 1],
        departments,
        employees}
      )
    }).catch(console.error)
  }

  render () {
    const departmentOptions = Object.entries(this.state.departments).map(
      ([id, name]) => ({ label: name, value: id })
    )

    const dateOptions = this.state.dates.map(
      value => ({ label: value, value: value })
    )

    return (
      <section className='ExploreCharts'>
        <div className='ExploreCharts__SelectContainer'>
          <label htmlFor='explore-charts-date-select'>Date</label>
          <Select
            className='ExploreCharts__Select ExploreCharts__DateSelect'
            id='explore-charts-date-select'
            onChange={this.setDate}
            clearable={false}
            options={dateOptions}
            value={this.state.date}
            isLoading={!this.state.date}
          />
          <label htmlFor='explore-charts-department-select'>Department</label>
          <Select
            className='ExploreCharts__Select ExploreCharts__DepartmentSelect'
            id='explore-charts-department-select'
            onChange={this.setDepartmentId}
            options={departmentOptions}
            value={this.state.departmentId}
            isLoading={!departmentOptions.length}
            placeholder='All departments'
          />
          <label htmlFor='explore-charts-attribute-select'>Attribute</label>
          <Select
            className='ExploreCharts__Select ExploreCharts__AttributeSelect'
            id='explore-charts-attribute-select'
            onChange={this.setAttribute}
            clearable={false}
            searchable={false}
            options={[
              {label: 'Ethnicity', value: ETHNICITY_ATTRIBUTE},
              {label: 'Gender', 'value': GENDER_ATTRIBUTE}
            ]}
            value={this.state.attribute}
          />
        </div>
        <IncomeLevelPieCharts
          employees={this.state.employees}
          departmentId={this.state.departmentId}
          attribute={this.state.attribute}
        />
      </section>
    )
  }

  setDate (option) {
    if (!option) {
      option = { value: '' }
    }

    this.setState({date: option.value})
    this.fetchEmployees(option.value).then(employees => this.setState({employees}))
  }

  setDepartmentId (option) {
    if (!option) {
      option = { value: '' }
    }

    this.setState({ departmentId: option.value })
  }

  setAttribute (option) {
    if (!option) {
      option = { value: '' }
    }

    this.setState({ attribute: option.value })
  }
}
