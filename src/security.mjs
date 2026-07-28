import {timingSafeEqual} from 'node:crypto';
import {resolve, sep} from 'node:path';

function equal(left, right) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function isAuthorized(header, expectedUser, expectedPassword) {
  if (!expectedPassword) return true;
  if (!header?.startsWith('Basic ')) return false;
  try {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const separator = decoded.indexOf(':');
    if (separator < 0) return false;
    return equal(decoded.slice(0, separator), expectedUser) && equal(decoded.slice(separator + 1), expectedPassword);
  } catch {
    return false;
  }
}

export function resolveInside(baseDirectory, requestedPath, workingDirectory = process.cwd()) {
  const base = resolve(baseDirectory);
  const candidate = resolve(workingDirectory, requestedPath);
  if (candidate === base || !candidate.startsWith(`${base}${sep}`)) {
    throw new Error(`Путь должен находиться внутри ${base}`);
  }
  return candidate;
}

export const securityHeaders = {
  'content-security-policy': "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  'referrer-policy': 'no-referrer',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()'
};
