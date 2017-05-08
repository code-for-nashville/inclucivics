import React, { PureComponent } from 'react'

import ReactHighCharts from './ReactHighCharts.js'

const defaultOptions = {
  chart: {
    backgroundColor: null,
    borderWidth: 0,
    type: 'area',
    margin: [
      2, 0, 2, 0
    ],
    width: 120,
    height: 20,
    style: {
      overflow: 'visible'
    },
    skipClone: true
  },
  title: {
    text: ''
  },
  credits: {
    enabled: false
  },
  xAxis: {
    labels: {
      enabled: false
    },
    title: {
      text: null
    },
    startOnTick: false,
    endOnTick: false,
    tickPositions: []
  },
  yAxis: {
    endOnTick: false,
    startOnTick: false,
    labels: {
      enabled: false
    },
    title: {
      text: null
    },
    tickPositions: [0]
  },
  legend: {
    enabled: false
  },
  tooltip: {
    backgroundColor: null,
    borderWidth: 0,
    shadow: false,
    useHTML: true,
    hideDelay: 0,
    shared: true,
    padding: 0,
    positioner: (w, h, point) => {
      return {
        x: point.plotX - w / 2,
        y: point.plotY - h
      }
    }
  },
  plotOptions: {
    series: {
      animation: false,
      lineWidth: 1,
      shadow: false,
      states: {
        hover: {
          lineWidth: 1
        }
      },
      marker: {
        radius: 1,
        states: {
          hover: {
            radius: 2
          }
        }
      },
      fillOpacity: 0.25
    },
    column: {
      negativeColor: '#910000',
      borderColor: 'silver'
    }
  }
}

export default class HighChartsSparkline extends PureComponent {
  render() {
    const config = ReactHighCharts.Highcharts.merge(defaultOptions, this.props.config || {})
    return <ReactHighCharts config={config}/>
  }
}
