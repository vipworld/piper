var stream = require('stream');
var Readable = stream.Readable
var StringReader;

StringReader = function() {
  var options = {};
  Readable.call(this, options);
  this.pause();
}

StringReader.prototype = Object.create(Readable.prototype);

StringReader.prototype.send = function(str, slices) {
  slices = slices || 2;
  this.slices = slices;
  this.segments = new Array(slices);
  var idx = Math.floor(str.length/slices);
  var startSlice = 0, toSlice = 0;

  for(var i=0;i<slices;i++) {
    if (i == (slices - 1))
      toSlice = str.length;
    else
      toSlice = idx * (i+1);

    this.segments[i] = new Buffer(str.slice(startSlice, toSlice));
    startSlice = toSlice;
  }
  this.idx = 0;
  this.resume();
};

StringReader.prototype._read = function() {
  var self = this;
  if (this.idx == this.slices) {
    this.push(null);
  } else {
    this.push(self.segments[self.idx]);
  }
  this.idx++;
};

module.exports = StringReader;
