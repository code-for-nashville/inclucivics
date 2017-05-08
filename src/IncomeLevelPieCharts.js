import React, { PureComponent } from 'react'

import ReactHighCharts from './ReactHighCharts.js'

import rollups from './data/department-rollups.json'

const piechartColors = (function() {
  const colors = []
  const base = ReactHighCharts.Highcharts.getOptions().colors[0]

  for (let i = 0; i < 10; i += 1) {
      let color = ReactHighCharts.Highcharts.Color(base).brighten((i - 3) / 7).get()
      colors.push(color)
  }

  return colors;
}())

export default class IncomeLevelPieCharts extends PureComponent {
  constructor(props) {
    super(props)
    this.rollups = rollups
  }

  render() {
    if (!this.props.department || !this.props.metric) {
      return null
    }

    const data = this.rollups[this.props.department][this.props.metric]
    const pieCharts = data.map((item, ix) => {
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
          text: item.income_level
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
        series: [item]
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
