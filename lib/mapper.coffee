{Transform} = require 'stream'

class Mapper extends Transform
  constructor: (fn) ->
    @mapper = fn
    super

  _transform: (chunk, encoding, done) ->
    if Buffer.isBuffer(chunk)
      input = chunk.toString()
    else 
      input = chunk
    try
      output = @mapper(input)
    catch e
      throw new Error("Error in mapper: #{e}")
    @push(new Buffer(output))
    done()
      

module.exports = Mapper
