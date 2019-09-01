import connect from 'connect';
import request from 'supertest';
import { IncomingMessage, ServerResponse } from 'http';

import crossdomain = require('..')

describe('crossdomain', () => {
  function app (middleware: ReturnType<typeof crossdomain>) {
    const result = connect();
    result.use(middleware);
    result.use((_req: IncomingMessage, res: ServerResponse) => {
      res.end('Hello world');
    });
    return result;
  }

  it('sets X-Permitted-Cross-Domain-Policies: none when called with no arguments', () => {
    return request(app(crossdomain()))
      .get('/')
      .expect('X-Permitted-Cross-Domain-Policies', 'none')
      .expect('Hello world');
  });

  it('sets X-Permitted-Cross-Domain-Policies: none when called with an empty object', () => {
    return request(app(crossdomain({})))
      .get('/')
      .expect('X-Permitted-Cross-Domain-Policies', 'none')
      .expect('Hello world');
  });

  it('can explicitly set the policy to "none"', () => {
    return request(app(crossdomain({ permittedPolicies: 'none' })))
      .get('/')
      .expect('X-Permitted-Cross-Domain-Policies', 'none')
      .expect('Hello world');
  });

  it('can set the policy to "master-only"', () => {
    return request(app(crossdomain({ permittedPolicies: 'master-only' })))
      .get('/')
      .expect('X-Permitted-Cross-Domain-Policies', 'master-only')
      .expect('Hello world');
  });

  it('can set the policy to "by-content-type"', () => {
    return request(app(crossdomain({ permittedPolicies: 'by-content-type' })))
      .get('/')
      .expect('X-Permitted-Cross-Domain-Policies', 'by-content-type')
      .expect('Hello world');
  });

  it('can set the policy to "all"', () => {
    return request(app(crossdomain({ permittedPolicies: 'all' })))
      .get('/')
      .expect('X-Permitted-Cross-Domain-Policies', 'all')
      .expect('Hello world');
  });

  it('cannot set the policy to "by-ftp-filename"', () => {
    expect(() => { crossdomain({ permittedPolicies: 'by-ftp-filename' }); }).toThrow();
  });

  it('cannot set the policy to invalid values', () => {
    expect(() => { crossdomain({ permittedPolicies: '' }); }).toThrow();
    expect(() => { crossdomain({ permittedPolicies: 'NONE' }); }).toThrow();
    /* eslint-disable @typescript-eslint/no-explicit-any */
    expect(() => { crossdomain({ permittedPolicies: null } as any); }).toThrow();
    expect(() => { crossdomain({ permittedPolicies: new String('none') } as any); }).toThrow(); // eslint-disable-line no-new-wrappers
    /* eslint-enable @typescript-eslint/no-explicit-any */
  });

  it('names its function and middleware', () => {
    expect(crossdomain.name).toStrictEqual('crossdomain');
    expect(crossdomain().name).toStrictEqual('crossdomain');
  });
});
