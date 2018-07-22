var crossdomain = require('..')

var assert = require('assert')
var connect = require('connect')
var request = require('supertest')

describe('crossdomain', function () {
  function app (middleware) {
    var result = connect()
    result.use(middleware)
    result.use(function (req, res) { res.end('Hello world') })
    return result
  }

  it('sets X-Permitted-Cross-Domain-Policies: none when called with no arguments', function () {
    return request(app(crossdomain()))
      .get('/')
      .expect('X-Permitted-Cross-Domain-Policies', 'none')
      .expect('Hello world')
  })

  it('sets X-Permitted-Cross-Domain-Policies: none when called with an empty object', function () {
    return request(app(crossdomain({})))
      .get('/')
      .expect('X-Permitted-Cross-Domain-Policies', 'none')
      .expect('Hello world')
  })

  it('can explicitly set the policy to "none"', function () {
    return request(app(crossdomain({ permittedPolicies: 'none' })))
      .get('/')
      .expect('X-Permitted-Cross-Domain-Policies', 'none')
      .expect('Hello world')
  })

  it('can set the policy to "master-only"', function () {
    return request(app(crossdomain({ permittedPolicies: 'master-only' })))
      .get('/')
      .expect('X-Permitted-Cross-Domain-Policies', 'master-only')
      .expect('Hello world')
  })

  it('can set the policy to "by-content-type"', function () {
    return request(app(crossdomain({ permittedPolicies: 'by-content-type' })))
      .get('/')
      .expect('X-Permitted-Cross-Domain-Policies', 'by-content-type')
      .expect('Hello world')
  })

  it('can set the policy to "all"', function () {
    return request(app(crossdomain({ permittedPolicies: 'all' })))
      .get('/')
      .expect('X-Permitted-Cross-Domain-Policies', 'all')
      .expect('Hello world')
  })

  it('cannot set the policy to "by-ftp-filename"', function () {
    assert.throws(function () {
      crossdomain({ permittedPolicies: 'by-ftp-filename' })
    })
  })

  it('cannot set the policy to invalid values', function () {
    assert.throws(function () {
      crossdomain({ permittedPolicies: '' })
    })
    assert.throws(function () {
      crossdomain({ permittedPolicies: null })
    })
    assert.throws(function () {
      crossdomain({ permittedPolicies: 'NONE' })
    })
  })

  it('names its function and middleware', function () {
    assert.equal(crossdomain.name, 'crossdomain')
    assert.equal(crossdomain().name, 'crossdomain')
  })
})
