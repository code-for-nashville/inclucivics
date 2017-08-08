import React, { Component } from 'react'

import Footer from './Footer.js'
import Nav from './Nav.js'
import Chart from './Chart.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

// START DATA HELPERS (To be moved and changed, depending on final data structure)
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


// END DATA HELPERS

class App extends Component {
  render() {
    return (
      <div className="App">
        <Nav/>
        <div className="Content">
          <Chart
            data={data}
            ethnicities={getEthnicitiesFromData(data)}
            salaries={getSalariesFromData(data)} />
        </div>
        <Footer/>
      </div>
    )
  }
}

export default App
