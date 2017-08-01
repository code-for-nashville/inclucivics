import React, { PureComponent } from 'react'

import {AreaChart, Area, XAxis, Tooltip} from 'recharts'

export default class Sparkline extends PureComponent {
  render() {
    const {
      data
    } = this.props
    return (
      <AreaChart
        width={120}
        height={40}
        data={data}
        margin={{top: 2, right: 0, left: 0, bottom: 2}}>
        <XAxis
          hide
          dataKey='name'/>
        <Tooltip
          hide/>
        <Area
          type='monotone'
          dataKey='change'
          stroke='#7cb5ec'
          fill='rgba(124,181,236,0.25)' />
      </AreaChart>
    )
  }
}
