const fs = require('fs')
const fetch = require('node-fetch')
const https = require('https')

/**
 * Fetches all of the data files stored on the Code For Nashville
 * Open Data Portal on GitHub and saves the files
 * in the input directory locally.
 * These files are needed for the preprartion that will
 * take place in the data-import script.
 */

const fetchPublishedData = async () => {
  const httpsAgent = https.Agent({
    rejectUnauthorized: false,
    requestCert: false
  })

  const options = {
    agent: httpsAgent
  }
  const apiEndpoint = 'https://api.github.com/repos'
  const repoAddress = '/code-for-nashville/open-data-portal'
  const path = '/nashville/metro-general-government-employees-demographic-data/renamed-csv'

  let res = await fetch(apiEndpoint + repoAddress + '/contents' + path, options)
  let resolved = await res.ok
  if (resolved) {
    let fileList = await res.json()
    fileList.map(async x => {
      let rows = await fetch(x.download_url, options)
      let data = await rows.text()
      var filename = x.name.replace(/-/g, '').slice(0, 6) + '01'
      fs.writeFileSync(`./input/${filename}.csv`, data)
    })
  } else {
    console.log('ERROR: ')
    console.log(await res.statusText)
  };
}

fetchPublishedData()
