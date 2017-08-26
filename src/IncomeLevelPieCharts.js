import React, { PureComponent } from 'react'

import ReactHighCharts from './ReactHighCharts.js'

import byDepartment from './data/summary-by-department.json'

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
  constructor (props) {
    super(props)
    this.byDepartment = byDepartment
  }

  render () {
    if (!this.props.department || !this.props.metric) {
      return null
    }

    const graphData = []
    const incomeLevels = this.byDepartment[this.props.department][this.props.metric]
    for (let level in incomeLevels) {
      const levelGraph = {
        level: level,
        data: [],
        type: 'pie'
      }

      let metrics = incomeLevels[level]
      for (let m in metrics) {
        levelGraph.data.push([m, metrics[m]])
      }

      graphData.push(levelGraph)
    }

    const pieCharts = graphData.map((graph, ix) => {
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
          text: graph.level
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
        series: [graph]
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
