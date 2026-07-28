import test from 'node:test';
import assert from 'node:assert/strict';
import {isAuthorized, resolveInside} from '../src/security.mjs';

test('Basic authentication accepts only exact credentials', () => {
  const header = `Basic ${Buffer.from('owner:correct horse').toString('base64')}`;
  assert.equal(isAuthorized(header, 'owner', 'correct horse'), true);
  assert.equal(isAuthorized(header, 'owner', 'wrong'), false);
  assert.equal(isAuthorized('', 'owner', 'correct horse'), false);
  assert.equal(isAuthorized('', 'owner', ''), true);
});

test('document paths are constrained to the data directory', () => {
  assert.equal(resolveInside('/app/data', 'data/report.md', '/app'), '/app/data/report.md');
  assert.throws(() => resolveInside('/app/data', '/etc/passwd', '/app'), /внутри/);
  assert.throws(() => resolveInside('/app/data', 'data/../src/server.mjs', '/app'), /внутри/);
});
