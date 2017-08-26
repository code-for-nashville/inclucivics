import React, { PureComponent } from 'react'

import Select from 'react-select'
import IncomeLevelPieCharts from './IncomeLevelPieCharts.js'

import 'react-select/dist/react-select.css'
import './ExploreCharts.css'

const arrayToOptions = (array) => {
  return array.map((el) => ({ label: el, value: el }))
}

export default class ExploreCharts extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      departments: [],
      department: 'All Departments',
      metric: 'ethnicity'
    }

    this.setDepartment = this.setDepartment.bind(this)
    this.setMetric = this.setMetric.bind(this)
  }

  loadDepartments () {
    window.fetch('./data/departments.json')
      .then(res => res.json())
      .then(departments => {
        this.setState({departments})
      })
      .catch(console.error)
  }

  componentDidMount () {
    this.loadDepartments()
  }

  render () {
    return (
      <section className='ExploreCharts'>
        <div className='ExploreCharts__SelectContainer'>
          <h2>Select a department and a metric to generate a custom report for the most recent year</h2>
          <Select
            className='ExploreCharts__Select ExploreCharts__DepartmentSelect'
            onChange={this.setDepartment}
            options={arrayToOptions(this.state.departments)}
            value={this.state.department}
          />
          <Select
            className='ExploreCharts__Select ExploreCharts__MetricSelect'
            onChange={this.setMetric}
            options={arrayToOptions(['ethnicity', 'gender'])}
            value={this.state.metric}
          />
        </div>
        <IncomeLevelPieCharts
          department={this.state.department}
          metric={this.state.metric}
        />
      </section>
    )
  }

  setDepartment (option) {
    if (!option) {
      option = { value: '' }
    }

    this.setState({ department: option.value })
  }

  setMetric (option) {
    if (!option) {
      option = { value: '' }
    }

    this.setState({ metric: option.value })
  }
}
