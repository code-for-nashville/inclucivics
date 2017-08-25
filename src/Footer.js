import React from 'react'

import mhrcLogo from './img/metro-human-rights-commision-logo.png'

import './Footer.css'

export default (props) => (
  <footer className='col-xs-12'>
    <div className='container'>
      Brought to you by <a rel='noopener noreferrer' target='_blank' href='http://www.codefornashville.org'>
        Code for Nashville
      </a> and the <a rel='noopener noreferrer' target='_blank' title='Metro Human Relations Commission' href='http://www.nashville.gov/Human-Relations-Commission.aspx'>
        <img src={mhrcLogo} alt='Metro Human Relations Commission' />
      </a>
    </div>
  </footer>
)
