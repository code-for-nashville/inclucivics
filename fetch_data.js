var fs = require('fs');
var request = require('request');

const DATA_URL = 'http://data.nashville.gov/api/views/4ibi-mxs4'

/**
 * HTTP requests for latest published General Government Employees Demographics dataset.
 */
function fetchPublishedData() {
  request(DATA_URL, function (error, response, body) {
    var data = JSON.parse(body)
    var rowsUpdatedAt = new Date(data['rowsUpdatedAt']*1000)
    var filename = rowsUpdatedAt.toISOString().replace(/-/g, '').slice(0, 8)
    request(`${DATA_URL}/rows.csv`).pipe(fs.createWriteStream(`./input/${filename}.csv`))
  });
}

fetchPublishedData();
