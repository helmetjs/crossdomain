Helmet's crossdomain.xml middleware
===================================

[![Build Status](https://travis-ci.org/helmetjs/crossdomain.svg?branch=master)](https://travis-ci.org/helmetjs/crossdomain)

Adobe defines [the spec for crossdomain.xml](https://www.adobe.com/devnet/adobe-media-server/articles/cross-domain-xml-for-streaming.html), a policy file that grants some Adobe products (like Flash) read access to resources on your domain. An unrestrictive policy could let others load things off your domain that you don't want.

To serve up a restrictive policy:

```javascript
var crossdomain = require('helmet-crossdomain')
app.use(crossdomain())
```

This serves the policy at `/crossdomain.xml`.

This doesn't make you wildly more secure, but it does help to keep Flash from loading things that you don't want it to. You might also *want* some of this behavior, in which case you should make your own less-restrictive policy and serve it.
