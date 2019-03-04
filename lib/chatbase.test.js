const mocha = require('mocha')
const chai = require('chai')
const should = chai.should()
const Chatbase = require('./index')

describe('getWatermark', () => {
  let chatbase

  before(async () => {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = 'keys/key.json'
  })

  // before/after implicitly testing put empty and delete :/
  beforeEach(async () => {
    chatbase = new Chatbase(bucket = 'gbv-chatbase-test')
    await chatbase.put('foo', 'bar')
  })

  afterEach(async () => {
    await chatbase.delete('foo')
  })

  it('should get a single value when it exists', async () => {
    const foo = await chatbase.get('foo')
    foo.should.deep.equal(['bar'])
  })

  it('should return undefined when the value doesnt exist', async () => {
    const foo = await chatbase.get('nope')
    should.not.exist(foo)
  })

  it('should add a value via put', async () => {
    await chatbase.put('foo', 'baz')
    const foo = await chatbase.get('foo')
    foo.should.deep.equal(['bar', 'baz'])
  })

  it('should unique the values', async () => {
    await chatbase.put('foo', 'bar')
    const foo = await chatbase.get('foo')
    foo.should.deep.equal(['bar'])
  })

  it('should accept options to download ', async () => {
    const foo = await chatbase.get('foo', {validation: false})
    foo.should.deep.equal(['bar'])
  })
})
