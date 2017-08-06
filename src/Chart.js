import React, {Component} from 'react'
import {
  VictoryChart,
  VictoryStack,
  VictoryArea,
  VictoryLegend,
  VictoryAxis
} from 'victory'

const salary1 = 30000
const salary2 = 60000
const salary3 = 90000


const data = {
  'American Indian/Alaskan Native': [{x: salary1, y: 2}, {x: salary2, y: 1}, {x: salary3, y: 2}],
  'Asian or Pacific Islander': [{x: salary1, y: 4}, {x: salary2, y: 4}, {x: salary3, y: 5}],
  'Black': [{x: salary1, y: 3}, {x: salary2, y: 6}, {x: salary3, y: 6}],
  'Hawaiian or Pacific Islander': [{x: salary1, y: 6}, {x: salary2, y: 4}, {x: salary3, y: 2}]
}

const getEthnicitiesFromData = (data) => {
  return Object.keys(data)
}

// Assumes every ethnicity has all dates
const getSalariesFromData = (data) => {
  return data[getEthnicitiesFromData(data)[0]].map(d => d.x)
}

const getLegendDataFromData = (data) => {
  return getEthnicitiesFromData(data).map(d => ({
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
        <VictoryChart>
          <VictoryStack>
            {areas}
          </VictoryStack>
          <VictoryAxis dependentAxis
            tickFormat={this.formatYAxisLabel}
          />
          <VictoryAxis tickValues={getSalariesFromData(data)}/>
        </VictoryChart>
        <VictoryLegend data={getLegendDataFromData(data)}/>
      </div>
    )
  }
}
