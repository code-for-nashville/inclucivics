import React, {Component} from 'react'
import {
  VictoryChart,
  VictoryStack,
  VictoryArea,
  VictoryLegend,
  VictoryAxis
} from 'victory'

const month1 = new Date('Jun 2017')
const month2 = new Date('Jul 2017')
const month3 = new Date('Aug 2017')


const data = {
  'American Indian/Alaskan Native': [{x: month1, y: 2}, {x: month2, y: 1}, {x: month3, y: 2}],
  'Asian or Pacific Islander': [{x: month1, y: 4}, {x: month2, y: 4}, {x: month3, y: 5}],
  'Black': [{x: month1, y: 3}, {x: month2, y: 6}, {x: month3, y: 6}],
  'Hawaiian or Pacific Islander': [{x: month1, y: 6}, {x: month2, y: 4}, {x: month3, y: 2}]
}

const getEthnicitiesFromData = (data) => {
  return Object.keys(data)
}

// Assumes every ethnicity has all dates
const getDatesFromData = (data) => {
  return data[getEthnicitiesFromData(data)[0]].map(d => d.x)
}

const getLegendDataFromData = (data) => {
  return Object.keys(data).map(d => ({
    name: d
  }))
}

// Looks ugly, but we know ethnicity is of fixed length. Time is a different story...
const getPercentDataFromData = (data) => {
  const ethnicities = getEthnicitiesFromData(data)
  const totals = data[ethnicities[0]].map((d, i) => {
    return ethnicities.reduce((memo, curr) => {
      return memo + data[curr][i].y
    }, 0)
  })

  return ethnicities.reduce((memo, curr) => ({
    ...memo,
    [curr]: data[curr].map((datum, i) => {
      return {x: datum.x, y: (datum.y / totals[i]) * 100}
    })
  }), {})
}

export default class Chart extends Component {
  formatYAxisLabel (percent) {
    return `${percent}%`
  }

  render () {
    const percentData = getPercentDataFromData(data)

    const areas = Object.keys(percentData).map(d => (
      <VictoryArea data={percentData[d]} key={d} />
    ))

    return (
      <div>
        <VictoryChart scale={{x: "time"}}>
          <VictoryStack>
            {areas}
          </VictoryStack>
          <VictoryAxis dependentAxis
            tickFormat={this.formatYAxisLabel}
          />
          <VictoryAxis />
        </VictoryChart>
        <VictoryLegend data={getLegendDataFromData(data)}/>
      </div>
    )
  }
}
