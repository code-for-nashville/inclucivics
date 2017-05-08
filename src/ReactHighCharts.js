import React, { PureComponent } from 'react'

import Highcharts from 'highcharts'

/*
  A simple wrapper around HighCharts for React

  The chart is fully recreated each type the props change.

  The content is mostly copied from https://facebook.github.io/react/docs/integrating-with-other-libraries.html
  and react-highcharts.
*/
class ReactHighCharts extends PureComponent {
  renderChart() {
    const chartConfig = this.props.config.chart
    this.chart = new Highcharts.Chart({
      ...this.props.config,
      chart: {
        ...chartConfig,
        renderTo: this.chartEl
      }
    })
  }

  componentDidUpdate(_, nextProps) {
    this.renderChart()
  }

  componentDidMount() {
    this.renderChart(this.props.config)
  }

  componentWillUnmount() {
    this.chart.destroy()
  }

  render() {
    return <div className="ReactHighCharts" ref={el => this.chartEl = el} />
  }
}

ReactHighCharts.defaultProps = {
  config: {}
}

ReactHighCharts.Highcharts = Highcharts

export default ReactHighCharts
