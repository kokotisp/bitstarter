var express = require('express');
var fs = require('fs');
buf = new Buffer(256);

var app = express.createServer(express.logger());
fs.readFile( "index.html", function (err, data) {
  if (err) cb( err );
});
var data = fs.readFileSync( "index.html" );


app.get('/', function(request, response) {
  response.send(buf.toString('utf8', 0, data));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
