import {existsSync, mkdirSync, readFileSync, renameSync, writeFileSync} from 'node:fs';
import {dirname} from 'node:path';

export class CommentStore {
  constructor(path, logger) {
    this.path = path;
    this.logger = logger;
    mkdirSync(dirname(path), {recursive: true});
    if (!existsSync(path)) this.write({});
  }

  read() {
    try {
      const value = JSON.parse(readFileSync(this.path, 'utf8'));
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (error) {
      this.logger.error('comments.read_failed', 'Не удалось прочитать хранилище комментариев', {error: error.message});
      throw new Error('Хранилище комментариев повреждено');
    }
  }

  write(value) {
    const temporary = `${this.path}.tmp`;
    writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, {mode: 0o600});
    renameSync(temporary, this.path);
  }

  list(issueKey) {
    return this.read()[issueKey] || [];
  }

  all() {
    return this.read();
  }

  counts() {
    return Object.fromEntries(Object.entries(this.read()).map(([key, comments]) => [key, comments.length]));
  }

  add(issueKey, text) {
    const store = this.read();
    const comment = {id: crypto.randomUUID(), text, createdAt: new Date().toISOString()};
    store[issueKey] = [...(store[issueKey] || []), comment];
    this.write(store);
    return comment;
  }

  remove(issueKey, id) {
    const store = this.read();
    const current = store[issueKey] || [];
    const next = current.filter(comment => comment.id !== id);
    if (next.length === current.length) return false;
    if (next.length) store[issueKey] = next;
    else delete store[issueKey];
    this.write(store);
    return true;
  }

  removeAll(issueKey) {
    const store = this.read();
    if (!store[issueKey]) return 0;
    const removed = store[issueKey].length;
    delete store[issueKey];
    this.write(store);
    return removed;
  }

  prune(issueKeys) {
    const active = new Set(issueKeys);
    const store = this.read();
    const removed = [];
    for (const key of Object.keys(store)) {
      if (!active.has(key)) {
        removed.push({issueKey: key, comments: store[key].length});
        delete store[key];
      }
    }
    if (removed.length) this.write(store);
    return removed;
  }
}
