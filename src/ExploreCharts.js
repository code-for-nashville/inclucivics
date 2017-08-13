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
      attribute: ETHNICITY_ATTRIBUTE
    }

    this.setDepartmentId = this.setDepartmentId.bind(this)
    this.setAttribute = this.setAttribute.bind(this)
  }

  loadDepartments () {
    window.fetch('./data/departments.json')
      .then(res => res.json())
      .then(departments => {
        this.setState({departments})
      })
      .catch(console.error)
  }

  loadEmployees () {
    window.fetch('./data/employees.csv')
    .then(res => res.text())
    .then(text => {
      const employees = csvParse(text)
      employees.forEach(employee => {
        employee.ethnicity = ETHNICITY_ID_LABELS[employee.ethnicityId]
      })
      this.setState({employees})
    }).catch(console.error)
  }

  componentDidMount () {
    this.loadDepartments()
    this.loadEmployees()
  }

  render () {
    const departmentOptions = Object.entries(this.state.departments).map(
      ([id, name]) => ({ label: name, value: id })
    )

    return (
      <section className='ExploreCharts'>
        <div className='ExploreCharts__SelectContainer'>
          <h2>Select a department and a metric to generate a custom report for the most recent year</h2>
          <Select
            className='ExploreCharts__Select ExploreCharts__DepartmentSelect'
            onChange={this.setDepartmentId}
            options={departmentOptions}
            value={this.state.departmentId}
          />
          <Select
            className='ExploreCharts__Select ExploreCharts__MetricSelect'
            onChange={this.setAttribute}
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
