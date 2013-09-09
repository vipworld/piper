require('coffee-script');
require('mochiscript');

var StrReader = require('./string-reader');
var strReader = new StrReader();

var Lines  = require('../lib/lines');
var lines  = new Lines();

var Mapper = require('../lib/mapper');
var mapper = new Mapper(function(input) {
  return input.replace("h", "b");
});

var Piper = require('../lib/piper');

var testStr = "hello\nworld\nhow\nare\nyou";
// strReader.pipe(mapper).pipe(process.stdout);
// strReader.pipe(lines).pipe(process.stdout);

var piper = new Piper(strReader);
piper
  .lines()
  .map(function(input) {
    return input.replace("h", "b");
  })
  .out(process.stdout);

strReader.send(testStr);
