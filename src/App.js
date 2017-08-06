import React, { Component } from 'react'

import Footer from './Footer.js'
import Nav from './Nav.js'
import Chart from './Chart.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Nav/>
        <div className="Content">
        <Chart />
        </div>
        <Footer/>
      </div>
    )
  }
}

export default App
