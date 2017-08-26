import React, { PureComponent } from 'react'

import GraphTable from './GraphTable'

export default class SummaryCharts extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      'summaries': []
    }
  }

  loadSummaries () {
    window.fetch('./data/summary.json')
      .then(res => res.json())
      .then(summaries => {
        this.setState({summaries})
      })
      .catch(console.error)
  }

  componentDidMount () {
    this.loadSummaries()
  }

  render () {
    // For each income level I need
    // an array of [demographic, [date,date,date]] pairs
    //
    const tables = this.state.summaries.map(summary => (
      <GraphTable summary={summary} key={summary.level} />
    ))

    return (
      <div className='SummaryCharts col-xs-12'>
        {tables}
      </div>
    )
  }
}
