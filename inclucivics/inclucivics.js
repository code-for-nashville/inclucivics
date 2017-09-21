var fs = require('fs')
var request = require('request')

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

const DATA_URL = 'http://data.nashville.gov/api/views/4ibi-mxs4'

/**
 * HTTP requests for latest published General Government Employees Demographics dataset.
 */
exports.lambda_handler = function fetchPublishedData (event, context, callback) {
  request(DATA_URL, function (error, response, body) {
    if (error) console.error(error)
    var data = JSON.parse(body)
    var rowsUpdatedAt = new Date(data['rowsUpdatedAt'] * 1000)
    var filename = rowsUpdatedAt.toISOString().replace(/-/g, '').slice(0, 8)
    request(`${DATA_URL}/rows.csv`, function (error, response, body) {
      var params = {Bucket: process.env.S3_BUCKET, Key: filename, Body: body, ACL: 'public-read'}
      s3.upload(params, function(err, data) {
        console.log(err, data);
        callback(null, data)
      })
    })
    //this would require an s3 streams library
    //.pipe(fs.createWriteStream(`./input/${filename}.csv`))
  })
}
