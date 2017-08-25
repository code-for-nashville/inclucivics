import React, { Component } from 'react'

import ChartTabs from './ChartTabs.js'
import Footer from './Footer.js'
import Nav from './Nav.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <Nav />
        <div className='Content'>
          <ChartTabs />
        </div>
        <Footer />
      </div>
    )
  }
}

export default App
