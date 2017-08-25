import React, { PureComponent } from 'react'

import GraphTable from './GraphTable'

import summaries from './data/summary.json'

export default class SummaryCharts extends PureComponent {
  render () {
    // For each income level I need
    // an array of [demographic, [date,date,date]] pairs
    //
    const tables = summaries.map(summary => (
      <GraphTable summary={summary} key={summary.level} />
    ))

    return (
      <div className='SummaryCharts col-xs-12'>
        {tables}
      </div>
    )
  }
}
