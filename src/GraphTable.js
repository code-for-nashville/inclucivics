import React, { PureComponent } from 'react'
import { format as formatDate, masks } from 'fecha'
import last from 'lodash.last'
import sortBy from 'lodash.sortby'
import ReactHighCharts from './ReactHighCharts.js'
import HighChartsSparkline from './HighChartsSparkline.js'

import './GraphTable.css'

export default class GraphTable extends PureComponent {
  render () {
    let latestDate

    const rows = this.props.summaries.map(summary => {
      const items = sortBy(summary.items, 'date')
      const lastItem = last(items)
      if (!latestDate) {
        latestDate = last(items).date
      }
      const sparklineConfig = {
        series: [{
          data: items.map(i => [Date.parse(i.date), i.percent * 100])
        }],
        chart: {
          style: {
            marginTop: 5
          }
        },
        xAxis: {
          type: 'datetime'
        },
        tooltip: {
          formatter: function () {
            // Deliberately let this take on the context in which it is called by using
            // `function` syntax
            return `${this.y.toFixed(3)}% - ${formatDate(this.x, 'MMM - YYYY')}`
          }
        }
      }

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
          formatter: function () {
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
          type: 'linear',
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
              fontSize: '10px'
            },
            formatter: function () {
              if (this.isLast) { return this.value + '%' } else { return this.value }
            }
          },
          plotBands: [
            {
              from: 0,
              to: 100,
              color: 'rgba(200, 200, 200, 0.7)'
            }
          ]
        },
        plotOptions: {
          bar: {
            borderWidth: 0
          }
        },
        chart: {
          type: 'bar',
          height: 50
        },
        series: [
          {
            data: [lastItem.percent * 100],
            name: summary.name
          }
        ]
      }

      return (
        <tr key={summary.name}>
          <td>
            {summary.name}
          </td>
          <td className='GraphTable__BarChart'>
            <ReactHighCharts config={barConfig} />
          </td>
          <td>
            <HighChartsSparkline config={sparklineConfig} />
          </td>
        </tr>
      )
    })

    return (
      <table className='GraphTable graph-table table'>
        <thead>
          <tr>
            <th>{this.props.title}</th>
            <th>% of Total Employees ({formatDate(latestDate, masks.shortDate)})</th>
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
