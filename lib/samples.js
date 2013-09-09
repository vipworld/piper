
var StringReader = require('./helpers/string-reader');
var stringReader = new StringReader();

var util = require('util');
var Transform = stream.Transform;

var lines = "moon\ntoon\nloon\nnoon";

var version = process.version
  , stream;
if (version === 'v0.8.18')
  stream = require('readable-stream');
else
  stream = require('stream');

var Transform = stream.Transform;
var LineParser;

LineParser = module.exports = function(options) {
  options = options || {};
  Transform.call(this, options);
  this._prev = [];
  this._nlEncountered = false;
};

LineParser.prototype = Object.create(
  Transform.prototype, { constructor: { value: LineParser }});

LineParser.prototype._transform = function(chunk, encoding, done) {
  if(encoding !== 'utf8') console.warn('utf8 expected');
  var slice = 0;
  this._nlEncountered = false;

  for (var i=0, len=chunk.length; i<len; i++) {
    if (chunk[i] === 10) {
      this._nlEncountered = true;
      this._prev.push(chunk.slice(slice,i+1));
      slice = i+1;
      this.push(Buffer.concat(this._prev));
      this._prev = [];
    } 
  }
  if (this._nlEncountered) {
    this._prev.push(chunk.slice(slice, i));
  } else {
    this._prev.push(chunk);
  }
  done();
};

LineParser.prototype._flush = function(done) {
  this.push(Buffer.concat(this._prev));
  done();
};

var stream = require('readable-stream');
var Transform = stream.Transform;

var util = require('util');
var url  = require('url');

var buildParser = function(fn) {
  function Parser() {
    Transform.call(this);
  }
  util.inherits(Parser, Transform);
  Parser.prototype._transform = fn;
  return new Parser();
};

var verbsRegex = /(GET|POST|PUT) \"([^\"]+)\"/;  

// pipe to these via line-transform
module.exports.base    = buildParser(#{
});

module.exports.rails   = function() {
  var _buf = [];
  return buildParser(#(chunk, encoding, done){
    var m = chunk.toString().match(verbsRegex)
    if (m) {
      var verb = m[1];
      var path = m[2];
      if (verb === 'GET' && path !== '/zz/health')
        this.push(path);
    }
    done();
  });
};

module.exports.urlList = function() {
  return buildParser(#(chunk, encoding, done){
    var urlObj = url.parse(chunk.toString().trim());
    if (urlObj.path) this.push(urlObj.path);
    done();
  });
};

module.exports.api = function() {
  return buildParser(#(chunk, encoding, done){
    var line = chunk.toString().trim();
    if(typeof line === 'string')
      var splitted = line.split("\t");
    if (splitted && splitted.length)
      this.push([splitted[8], splitted[9]].join("?"));
    done();
  });
};
