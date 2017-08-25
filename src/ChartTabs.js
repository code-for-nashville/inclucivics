import React, { Component } from 'react'

import ExploreCharts from './ExploreCharts.js'
import SummaryCharts from './SummaryCharts.js'

import './ChartTabs.css'

const SUMMARY_TAB = 'summary'
const CUSTOM_TAB = 'custom'

export default class ChartTabs extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: SUMMARY_TAB
    }
  }

  setTab (tabName) {
    this.setState({ tab: tabName })
  }

  render () {
    // Instead of swapping out the actual content, just set display: none on
    // unselected tabs.
    // ReactHighCharts destroys and recreates the component on mount and unmount
    // which is expensive
    let summaryChartsClass = ''
    let exploreChartsClass = ''

    switch (this.state.tab) {
      case SUMMARY_TAB:
        summaryChartsClass = 'active'
        break
      case CUSTOM_TAB:
        exploreChartsClass = 'active'
        break
      default:
        throw Error(`Bad tab "${this.state.tab}"`)
    }

    return (
      <div className='ChartTabs col-xs-12'>
        <div className='container'>
          <div className='tabs'>
            <a
              className={`tab ${summaryChartsClass}`}
              onClick={this.setTab.bind(this, SUMMARY_TAB)}
            >
              Summary
            </a>
            <a
              className={`tab ${exploreChartsClass}`}
              onClick={this.setTab.bind(this, CUSTOM_TAB)}
            >
              Explore
            </a>
          </div>

          <div style={{clear: 'both'}} />

          <div className='tabs-content'>
            <div className={`tab-content ${summaryChartsClass}`}>
              {<SummaryCharts />}
            </div>
            <div className={`tab-content ${exploreChartsClass}`}>
              {<ExploreCharts />}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
