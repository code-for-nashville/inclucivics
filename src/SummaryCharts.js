import React, { PureComponent } from 'react'
import groupBy from 'lodash.groupby'

import GraphTable from './GraphTable'
import { ETHNICITY_ID_LABELS, SALARY_BUCKET_LABELS, S3_URL } from './constants.js'

export default class SummaryCharts extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      'summaries': []
    }
  }

  fetchSummaries () {
    return window.fetch(`${S3_URL}/data/summaries.json`)
      .then(res => res.json())
      .then(summaries => {
        summaries.forEach(s => {
          let [year, month, day] = s.date.split("-").map((x) => parseInt(x))
          // Need to subtract 1 because Date's month field is 0 based
          s.date = new Date(year, month - 1, day)
        })
        return summaries
      })
      .catch(console.error)
  }

  componentDidMount () {
    this.fetchSummaries().then(summaries => {
      this.setState({summaries})
    })
  }

  render () {
    const bySalaryBucket = groupBy(this.state.summaries, 'salaryBucketId')
    const tables = []
    for (let bucket in bySalaryBucket) {
      const byEthnicity = groupBy(bySalaryBucket[bucket], 'ethnicityId')
      const ethnicitySummaries = Object.entries(byEthnicity).map(entry => {
        return {
          name: ETHNICITY_ID_LABELS[entry[0]],
          items: entry[1]
        }
      })
      tables.push(
        <GraphTable summaries={ethnicitySummaries} key={bucket} title={SALARY_BUCKET_LABELS[bucket]} />
      )
    }

    return (
      <div className='SummaryCharts col-xs-12'>
        {tables}
      </div>
    )
  }
}
