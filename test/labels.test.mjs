import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {LabelStore, normalizeLabels} from '../src/labels.mjs';
import {groupFor} from '../src/sync.mjs';

test('labels are normalized, deduplicated, persisted, and pruned', () => {
  assert.deepEqual(normalizeLabels([' Security ', 'security', 'Needs review']), ['Security', 'Needs review']);
  const directory = mkdtempSync(join(tmpdir(), 'teamwork-labels-'));
  try {
    const store = new LabelStore(join(directory, 'labels.json'), {error() {}});
    assert.deepEqual(store.set('DO-1', ['Platform', 'Urgent']), ['Platform', 'Urgent']);
    store.set('DO-2', ['Security']);
    assert.deepEqual(store.list('DO-1'), ['Platform', 'Urgent']);
    assert.deepEqual(store.prune(['DO-1']), ['DO-2']);
  } finally {
    rmSync(directory, {recursive: true, force: true});
  }
});

test('first local label overrides theme grouping', () => {
  const issue = {key: 'DO-1', title: 'Terraform module', description: '', labels: [], components: []};
  const config = {grouping: {labelGroupPrefix: 'Label', themes: [{name: 'IaC', pattern: 'terraform'}], fallbackTheme: 'Other'}};
  assert.equal(groupFor(issue, config, {}), 'IaC');
  assert.equal(groupFor(issue, config, {'DO-1': ['Priority', 'Secondary']}), 'Label: Priority');
});
