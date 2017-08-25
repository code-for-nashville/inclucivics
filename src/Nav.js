import React, { Component } from 'react'
import About from './About.js'

import './Nav.css'

class Nav extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showAbout: false
    }
    this.toggleAbout = this.toggleAbout.bind(this)
  }

  render () {
    const about = this.state.showAbout ? <About /> : null
    const aboutClass = this.state.showAbout ? 'Nav__aboutlink-active' : 'Nav__aboutlink'
    return (
      <nav className='navbar navbar-inclucivics'>
        <div className='container navbar-container'>
          <a className='navbar-brand' id='home-link'>IncluCivics</a>
          <a className={aboutClass} onClick={this.toggleAbout}>
            Analyzing the demographic makeup of 50 Metro Nashville departments
          </a>
          {about}
        </div>
      </nav>
    )
  }

  toggleAbout () {
    this.setState({showAbout: !this.state.showAbout})
  }
}

export default Nav
