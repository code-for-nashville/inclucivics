import React, { PureComponent } from 'react'
import groupBy from 'lodash.groupby'
import ReactHighCharts from './ReactHighCharts.js'
import constants from './constants.js'

// Adapted from a set of "Fall" colors
// http://duoparadigms.com/2013/10/11/10-color-palettes-perfect-autumnfall-season/
const piechartColors = [
  '#6D7696',
  '#59484F',
  '#455C4F',
  '#CC5543',
  '#EDB579',
  '#DBE6AF',
  '#694364',
  '#94353C'
]

export default class IncomeLevelPieCharts extends PureComponent {
  render () {
    if (!this.props.attribute) {
      return null
    }

    let employees = this.props.employees
    if (this.props.departmentId) {
      employees = this.props.employees.filter(
        e => e.departmentId === this.props.departmentId
      )
    }

    const bySalaryBucket = groupBy(employees, e => e.salaryBucketId)

    // Get totals for each attribute group w/in each income group
    const pieCharts = Object.keys(bySalaryBucket).map((bucket, ix) => {
      const byAttribute = groupBy(
        bySalaryBucket[bucket],
        e => e[this.props.attribute]
      )

      const data = constants.ATTRIBUTE_TO_CHOICES[this.props.attribute].map(
        (choice) => [choice, (byAttribute[choice] || []).length]
      )

      const config = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: true
        },
        exporting: {
          enabled: false
        },
        title: {
          text: constants.SALARY_BUCKET_LABELS[bucket]
        },
        tooltip: {
          pointFormat: '{name}: <b>{point.percentage:.1f}%</b>'
        },
        legend: {
          enabled: true,
          labelFormat: '<b>{name}</b>: <b>{y:.1f}</b>   ({percentage:.1f}%)</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            colors: piechartColors,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        series: [{data, type: 'pie'}]
      }

      return <ReactHighCharts key={ix} config={config} />
    })

    return (
      <div className='IncomeLevelPieCharts'>
        {pieCharts}
      </div>
    )
  }
}
