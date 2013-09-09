{Transform} = require 'stream'

class Lines extends Transform
  constructor: (fn) ->
    @_prev = []
    @_nlEncountered = false
    super

  _transform: (chunk, encoding, done) ->
    console.warn "utf8 expected"  if encoding isnt "utf8"
    slice = 0
    @_nlEncountered = false

    i = 0
    len = chunk.length
    while i < len
      if chunk[i] is 10
        @_nlEncountered = true
        @_prev.push chunk.slice(slice, i + 1)
        slice = i + 1
        @push Buffer.concat(@_prev)
        @_prev = []
      i++

    if @_nlEncountered
      @_prev.push chunk.slice(slice, i)
    else
      @_prev.push chunk
    done()

  _flush: (done) ->
    @push(Buffer.concat(@_prev))
    done()

module.exports = Lines
