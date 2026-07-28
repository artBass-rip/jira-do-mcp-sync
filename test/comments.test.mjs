import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {CommentStore} from '../src/comments.mjs';

test('comments persist, delete, and prune by issue key', () => {
  const directory = mkdtempSync(join(tmpdir(), 'teamwork-comments-'));
  try {
    const store = new CommentStore(join(directory, 'comments.json'), {error() {}});
    const first = store.add('DO-1', 'First');
    store.add('DO-2', 'Second');
    assert.equal(store.list('DO-1')[0].text, 'First');
    assert.equal(store.remove('DO-1', first.id), true);
    assert.deepEqual(store.prune(['DO-1']), [{issueKey: 'DO-2', comments: 1}]);
    assert.deepEqual(JSON.parse(readFileSync(join(directory, 'comments.json'), 'utf8')), {});
  } finally {
    rmSync(directory, {recursive: true, force: true});
  }
});
