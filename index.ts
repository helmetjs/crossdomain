import { IncomingMessage, ServerResponse } from 'http';

interface CrossDomainOptions {
  permittedPolicies?: string;
}

function getHeaderValueFromOptions (options: CrossDomainOptions) {
  const DEFAULT_PERMITTED_POLICIES = 'none';
  const ALLOWED_POLICIES = [
    'none',
    'master-only',
    'by-content-type',
    'all',
  ];

  let permittedPolicies: string;
  if ('permittedPolicies' in options) {
    permittedPolicies = options.permittedPolicies as string;
  } else {
    permittedPolicies = DEFAULT_PERMITTED_POLICIES;
  }

  if (ALLOWED_POLICIES.indexOf(permittedPolicies) === -1) {
    throw new Error(`"${permittedPolicies}" is not a valid permitted policy. Allowed values: ${ALLOWED_POLICIES.join(', ')}.`);
  }

  return permittedPolicies;
}

export = function crossdomain (options: CrossDomainOptions = {}) {
  const headerValue = getHeaderValueFromOptions(options);

  return function crossdomain (_req: IncomingMessage, res: ServerResponse, next: () => void) {
    res.setHeader('X-Permitted-Cross-Domain-Policies', headerValue);
    next();
  };
}
