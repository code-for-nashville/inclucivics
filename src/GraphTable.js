import React, { PureComponent } from 'react'

import ReactHighCharts from './ReactHighCharts.js'
import Sparkline from './Sparkline.js'

import './GraphTable.css'

const last = (array) => {
  return array[array.length - 1]
}

export default class GraphTable extends PureComponent {
  render() {
    const summary = this.props.summary
    const latestDate = last(summary.dates)
    const rows = summary.data.map((item) => {
      const barConfig = {
        title: null,
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        tooltip: {
          formatter: function() {
              // Deliberately let this take on the context in which it is called by using
              // `function` syntax``
              return `${this.y.toFixed(3)}%`
          }
        },
        xAxis: {
          tickLength: 0,
          labels: {
            enabled: false
          }
        },
        yAxis: {
          endOnTick: true,
          startOnTick: true,
          min: 0,
          max: 100,
          minPadding: 0,
          maxPadding: 0,
          type: "linear",
          tickInterval: 25,
          breaks: [
            {
              from: 0.001,
              to: 0.01
            }, {}
          ],
          tickWidth: 0,
          tickLength: 0,
          tickHeight: 2,
          title: {
            text: null
          },
          labels: {
            y: 12,
            style: {
              fontSize: "10px"
            },
            formatter: function() {
              if (this.isLast)
                return this.value + "%"
              else
                return this.value
            }
          },
          plotBands: [
            {
              from: 0,
              to: 100,
              color: "rgba(200, 200, 200, 0.7)"
            }
          ]
        },
        plotOptions: {
          bar: {
            borderWidth: 0
          }
        },
        chart: {
          type: "bar",
          height: 50
        },
        series: [
          {
            data: [last(item.data)],
            name: item.name
          }
        ]
      }

      const sparklineData = item.data.map((d, i) => {
        return {
          change: d,
          name: `${d.toFixed(3)}% - ${summary.dates[i]}`
        }
      })

      return (
        <tr key={item.name}>
          <td>
            {item.name}
          </td>
          <td className="GraphTable__BarChart">
            <ReactHighCharts config={barConfig}/>
          </td>
          <td>
            <Sparkline data={sparklineData}/>
          </td>
        </tr>
      )
    })

    return (
      <table className="GraphTable graph-table table">
        <thead>
          <tr>
            <th>{summary.level}</th>
            <th>% of Total Employees ({latestDate})</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
}
