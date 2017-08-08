import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  VictoryChart,
  VictoryStack,
  VictoryArea,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory'

import Legend from './Legend.js'

export default class Chart extends Component {
  static props = {
    data: PropTypes.object, // TODO: Define better
    salaries: PropTypes.arrayOf(PropTypes.number),
    ethnicities: PropTypes.arrayOf(PropTypes.string)
  }

  state = {
    filteredItems:[]
  }

  formatYAxisLabel (percent) {
    return `${percent}%`
  }

  formatXAxisLabel (salary) {
    return `$${salary}`
  }

  formatTooltipLabel (datum) {
    return `${datum.ethnicity}: ${datum.count}`
  }

  getFilteredData (data, ethnicities, filteredItems) {
    return ethnicities.reduce((memo, ethnicity) => {
      if (!!~filteredItems.indexOf(ethnicity)) return memo
      return {
        ...memo,
        [ethnicity]: data[ethnicity]
      }
    }, {})
  }

  getLegendData (data, ethnicities, filteredItems) {
    return ethnicities.map(d => ({
      name: d,
      checked: !~filteredItems.indexOf(d)
    }))
  }

  // Looks ugly, but we know ethnicity is of fixed length. Time is a different story...
  getPercentData (data, ethnicities) {
    const totals = data[ethnicities[0]].map((d, i) => {
      return ethnicities.reduce((memo, ethnicity) => {
        return memo + data[ethnicity][i].y
      }, 0)
    })

    return ethnicities.reduce((memo, ethnicity) => ({
      ...memo,
      [ethnicity]: data[ethnicity].map((datum, i) => {
        return {x: datum.x, y: (datum.y / totals[i]) * 100, count: datum.y, ethnicity}
      })
    }), {})
  }

  handleLegendFilterAdd = (item) => {
    const filteredItems = this.state.filteredItems.concat(item)

    this.setState(state => ({filteredItems}))
  }

  handleLegendFilterRemove = (item) => {
    const filteredItems = this.state.filteredItems.filter(i => i !== item)

    this.setState(state => ({filteredItems}))
  }

  render () {
    const {
      filteredItems
    } = this.state

    const {
      salaries,
      ethnicities,
      data
    } = this.props

    const filteredData = this.getFilteredData(data, ethnicities, filteredItems)
    const remainingEthnicities = ethnicities.filter(e => !~filteredItems.indexOf(e))
    const percentData = this.getPercentData(filteredData, remainingEthnicities)

    const areas = Object.keys(percentData).map(d => (
      <VictoryArea data={percentData[d]} key={d} />
    ))

    return (
      <div>
        <VictoryChart containerComponent={
          <VictoryVoronoiContainer
            dimension='x'
            labels={this.formatTooltipLabel}
            labelComponent={<VictoryTooltip />}
          />}>
          <VictoryStack>
            {areas}
          </VictoryStack>
          <VictoryAxis
            dependentAxis
            tickFormat={this.formatYAxisLabel}
          />
          <VictoryAxis
            tickFormat={this.formatXAxisLabel}
            tickValues={salaries} />
        </VictoryChart>
        <Legend
          onFilterRemove={this.handleLegendFilterRemove}
          onFilterAdd={this.handleLegendFilterAdd}
          data={this.getLegendData(data, ethnicities, filteredItems)} />
      </div>
    )
  }
}
