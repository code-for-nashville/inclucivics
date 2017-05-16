import React, { PureComponent } from 'react'

import ReactHighCharts from './ReactHighCharts.js'

import byDepartment from './data/summary-by-department.json'

const piechartColors = (function() {
  const colors = []
  const base = ReactHighCharts.Highcharts.getOptions().colors[0]

  for (let i = -5; i < 5; i += 1) {
      let color = ReactHighCharts.Highcharts.Color(base).brighten(i / 10).get()
      colors.push(color)
  }

  return colors;
}())

export default class IncomeLevelPieCharts extends PureComponent {
  constructor(props) {
    super(props)
    this.byDepartment = byDepartment
  }

  render() {
    if (!this.props.department || !this.props.metric) {
      return null
    }

    const graphData = []
    const incomeLevels = this.byDepartment[this.props.department][this.props.metric]
    for(let level in incomeLevels) {
      const levelGraph = {
        level: level,
        data: [],
        type: 'pie'
      }

      let metrics = incomeLevels[level]
      for(let m in metrics) {
        levelGraph.data.push([m, metrics[m]])
      }

      graphData.push(levelGraph)
    }

    const pieCharts = graphData.map((graph, ix) => {
      const config = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: true,
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

      return <ReactHighCharts key={ix} config={config}/>
    })

    return (
      <div className="IncomeLevelPieCharts">
        {pieCharts}
      </div>
    )
  }
}
