#!/usr/bin/env node
/*
Quick hacks little time sorry.
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "";
var URL_DEFAULT = "";
var CHECKSFILE_DEFAULT = "checks.json";
var sys = require('util'),
    rest = require('restler');

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertUrlExists = function(Url) {
var instr;
rest.get(Url.toString()).on('complete', function(result) {
  if (result instanceof Error) {
    sys.puts('Error: ' + result.message);
    this.retry(5000); // try again after 5 sec
  } else {
    instr= result;
	fs.writeFileSync("index2.html", instr, 'utf8');
	var checkJson = checkHtmlFile("index2.html", program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
   	 console.log(outJson);
	fs.unlinkSync("index2.html")
  }

});
};

var cheerioHtmlFile = function(htmlfile) {

    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};


var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <remote>', 'Remote url', clone(assertUrlExists), URL_DEFAULT)
        .parse(process.argv);


if (program.file!=""){var checkJson = checkHtmlFile(program.file, program.checks);var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);} 

    
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
