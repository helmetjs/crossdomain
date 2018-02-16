var url = require('url')

var POLICY = [
  '<?xml version="1.0"?>',
  '<!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">',
  '<cross-domain-policy>',
  '<site-control permitted-cross-domain-policies="none"/>',
  '</cross-domain-policy>'
].join('')

module.exports = function crossdomain () {
  return function crossdomain (req, res, next) {
    var pathname = url.parse(req.url).pathname

    if (pathname === '/crossdomain.xml') {
      res.writeHead(200, {
        'Content-Type': 'text/x-cross-domain-policy'
      })
      res.end(POLICY)
    } else {
      next()
    }
  }
}
