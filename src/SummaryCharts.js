import React, { PureComponent } from 'react'

import GraphTable from './GraphTable'

import summaries from './data/summary.json'

export default class SummaryCharts extends PureComponent {
  render() {
    const tables = summaries.map((summary) => (
      <GraphTable data={summary} key={summary.title}/>
    ))

    return (
      <div className="SummaryCharts col-xs-12">
        {tables}
      </div>
    )
  }
}
