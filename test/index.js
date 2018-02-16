var crossdomain = require('..')

var assert = require('assert')
var connect = require('connect')
var request = require('supertest')

var EXPECTED_POLICY = [
  '<?xml version="1.0"?>',
  '<!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">',
  '<cross-domain-policy>',
  '<site-control permitted-cross-domain-policies="none"/>',
  '</cross-domain-policy>'
].join('')

describe('crossdomain', function () {
  function app () {
    var result = connect()
    result.use(crossdomain())
    result.use(function (req, res) { res.end('Hello world') })
    return result
  }

  it("doesn't respond to requests to /", function () {
    return request(app()).get('/').expect('Hello world')
  })

  it("doesn't respond to requests to different casing", function () {
    return Promise.all([
      request(app()).get('/CROSSDOMAIN.XML').expect('Hello world'),
      request(app()).get('/crossdomain.XML').expect('Hello world'),
      request(app()).get('/CROSSDOMAIN.xml').expect('Hello world')
    ])
  })

  it('responds with proper XML when visiting /crossdomain.xml', function () {
    return request(app()).get('/crossdomain.xml')
      .expect('Content-Type', 'text/x-cross-domain-policy')
      .expect(EXPECTED_POLICY)
  })

  it('responds with proper XML when visiting /crossdomain.xml with query string', function () {
    return request(app()).get('/crossdomain.xml?hi=5')
      .expect('Content-Type', 'text/x-cross-domain-policy')
      .expect(EXPECTED_POLICY)
  })

  it('names its function and middleware', function () {
    assert.equal(crossdomain.name, 'crossdomain')
    assert.equal(crossdomain().name, 'crossdomain')
  })
})
