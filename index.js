var parse = require('url').parse;
var etag = require('etag');

var data = '<?xml version="1.0"?>' +
  '<!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">' +
  '<cross-domain-policy>' +
  '<site-control permitted-cross-domain-policies="none"/>' +
  '</cross-domain-policy>';
var etagValue = etag(data, { weak: true });

module.exports = function crossdomain(options) {

  options = options || {};
  var caseSensitive = options.caseSensitive;
  var shouldSendEtag = (options.etag === undefined) ? true : options.etag;

  var headers = { 'Content-Type': 'text/x-cross-domain-policy' };
  if (shouldSendEtag) {
    headers.ETag = etagValue;
  }

  return function crossdomain(req, res, next) {

    var pathname = parse(req.url).pathname;

    var uri;
    if (caseSensitive) {
      uri = pathname;
    } else {
      uri = pathname.toLowerCase();
    }

    if ('/crossdomain.xml' === uri) {
      if (req.headers['if-none-match'] === etagValue) {
        res.writeHead(304);
        res.end();
      } else {
        res.writeHead(200, headers);
        res.end(data);
      }
    } else {
      next();
    }

  };

};
