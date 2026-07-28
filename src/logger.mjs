import {appendFileSync, existsSync, mkdirSync, readFileSync, renameSync, statSync} from 'node:fs';
import {dirname} from 'node:path';

export class Logger {
  constructor(path, {level = 'info', maxEntries = 500, maxBytes = 5_000_000, keepFiles = 3} = {}) {
    this.path = path;
    this.maxEntries = maxEntries;
    this.maxBytes = maxBytes;
    this.keepFiles = keepFiles;
    this.level = level;
    this.entries = [];
    mkdirSync(dirname(path), {recursive: true});
    if (existsSync(path)) {
      this.entries = readFileSync(path, 'utf8').trim().split('\n').slice(-maxEntries).flatMap(line => {
        try { return [JSON.parse(line)]; } catch { return []; }
      });
    }
  }

  configure({level, maxEntries, maxFileSizeMb, keepFiles} = {}) {
    if (level) this.level = level;
    if (maxEntries) this.maxEntries = maxEntries;
    if (maxFileSizeMb) this.maxBytes = maxFileSizeMb * 1_000_000;
    if (keepFiles) this.keepFiles = keepFiles;
  }

  rotate() {
    if (!existsSync(this.path) || statSync(this.path).size < this.maxBytes) return;
    for (let index = this.keepFiles - 1; index >= 1; index--) {
      const source = `${this.path}.${index}`;
      if (existsSync(source)) renameSync(source, `${this.path}.${index + 1}`);
    }
    renameSync(this.path, `${this.path}.1`);
  }

  write(level, event, message, context = {}) {
    const priority = {debug: 10, info: 20, warn: 30, error: 40};
    if ((priority[level] || 20) < (priority[this.level] || 20)) return null;
    const entry = {timestamp: new Date().toISOString(), level, event, message, ...context};
    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) this.entries.splice(0, this.entries.length - this.maxEntries);
    this.rotate();
    appendFileSync(this.path, `${JSON.stringify(entry)}\n`);
    const output = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    output(`[${entry.timestamp}] ${level.toUpperCase()} ${event}: ${message}`);
    return entry;
  }

  debug(event, message, context) { return this.write('debug', event, message, context); }
  info(event, message, context) { return this.write('info', event, message, context); }
  warn(event, message, context) { return this.write('warn', event, message, context); }
  error(event, message, context) { return this.write('error', event, message, context); }
  recent(limit = 200, level = '') {
    const filtered = level ? this.entries.filter(entry => entry.level === level) : this.entries;
    return filtered.slice(-Math.min(Math.max(Number(limit) || 200, 1), 500)).reverse();
  }
}
