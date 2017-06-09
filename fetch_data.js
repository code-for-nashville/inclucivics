var fs = require('fs');
var http = require('http');

/**
 * Function that parses dates from .csv files in ./input.
 * Passes the most recent date to the callback.
 * @callback {fetchPublishedData} cb - Fetches latest metadata and checks if it is newer
 */
function  checkForNewData(cb){
 fs.readdir('./input',function(err,files){
   var newDate
   var oldDate = new Date(2000, 01, 01)
   files.forEach(file => {
     var year = file.slice(0,4)
     var month = file.slice(4,6)
     var day = file.slice(6,8)
     newDate = new Date(year, month, day)
     if (oldDate < newDate) {
       oldDate = newDate
     }
   })
   return cb(newDate);
 });
}


/**
 * HTTP requests for latest published General Government Employees Demographics dataset.
 * @param {Date} - The date of the last downloaded data set
 */
function fetchPublishedData(lastDownloaded) {
  http.request({host: 'data.nashville.gov', path: '/api/views/4ibi-mxs4' }, (response) => {
    var responseData = ''

    response.on('data', function (chunk) {
      responseData += chunk;
    })

    response.on('end', function () {
      data = JSON.parse(responseData)
      var lastUpdated = new Date(data['rowsUpdatedAt']*1000)
      if (lastUpdated > lastDownloaded) {
        http.request({host: 'data.nashville.gov', path: '/api/views/4ibi-mxs4/rows.csv' }, (response) => {
          responseData = '';

          response.on('data', function (chunk) {
            responseData += chunk
          });

          response.on('end', function () {
            var re = new RegExp('-', "g")
            var filename = lastUpdated.toISOString().replace(/-/g, '').slice(0, 8)

            fs.writeFile(`./input/${filename}.csv`, responseData, function(err) {
              console.log("The file was saved!");
              if(err) {
                return console.log(err);
              }
            })
          }
        )}).end()
      }
    })
  }).end()
}

checkForNewData(fetchPublishedData);
