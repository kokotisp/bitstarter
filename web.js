var express = require('express');
var fs = require('fs');
var buffer = new Buffer(32);
var app = express.createServer(express.logger();

buffer = fs.readFileSync('index.html','utf-8')

app.get('/', function(request, response) {
  response.send(buffer);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
