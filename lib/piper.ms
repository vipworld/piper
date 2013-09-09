var zlib   = require('zlib')
var Mapper = require('./mapper');
var Lines  = require('./lines');

export class Piper {
  function initialize(readable) {
    this.streamFrom = readable;
  }

  function pipe(stream) {
    this.streamFrom.pipe(stream);
    this.streamFrom = stream;
    return this;
  }

  function gunzip() {
    var zPipe = zlib.createGunzip();
    return this.pipe(zPipe);
  }

  function map(fn) {
    var mapper = new Mapper(fn);
    return this.pipe(mapper);
  }

  function lines() {
    var lines = new Lines();
    return this.pipe(lines);
  }

  function out(writable) {
    return this.streamFrom.pipe(writable);
  }
}

