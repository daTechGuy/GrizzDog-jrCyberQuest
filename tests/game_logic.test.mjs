// Game-logic tests for the browser games. Run: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const JS = join(ROOT, 'static', 'js');

// Load the game files into one shared global scope, like <script> tags in the page.
function loadGames() {
  const ctx = vm.createContext({ console });
  for (const f of ['k2-messages.js', 'k2.js', 'g35.js']) {
    vm.runInContext(readFileSync(join(JS, f), 'utf8'), ctx, { filename: f });
  }
  return (expr) => vm.runInContext(expr, ctx);
}

test('K-2 messages are complete and short enough for early readers', () => {
  const run = loadGames();
  const deck = run('PHISH_DECK');
  assert.ok(deck.length >= 30, `expected at least 30 messages, got ${deck.length}`);
  for (const m of deck) {
    for (const key of ['icon', 'from', 'text', 'win', 'oops']) {
      assert.ok(typeof m[key] === 'string' && m[key].trim(), `${m.text}: missing ${key}`);
    }
    assert.ok([1, 2, 3].includes(m.level), `${m.text}: level must be 1-3`);
    assert.ok(['trap', 'safe'].includes(m.type), `${m.text}: type must be trap or safe`);
    assert.ok(m.text.split(/\s+/).length <= 12, `${m.text}: keep K-2 messages to 12 words or fewer`);
  }
  const texts = deck.map(m => m.text);
  assert.equal(new Set(texts).size, texts.length, 'duplicate message text');
});

test('every K-2 message has a complete, short Spanish version', () => {
  const run = loadGames();
  for (const m of run('PHISH_DECK')) {
    assert.ok(m.es, `${m.text}: missing es (Spanish) translation`);
    for (const key of ['from', 'text', 'win', 'oops']) {
      assert.ok(typeof m.es[key] === 'string' && m.es[key].trim(), `${m.text}: missing es.${key}`);
    }
    assert.ok(m.es.from.includes('De:'), `${m.text}: Spanish "from" should start with "De:"`);
    assert.ok(m.es.text.split(/\s+/).length <= 12, `${m.es.text}: keep Spanish K-2 messages to 12 words or fewer`);
  }
});

test('K-2 English and Spanish screen text match key for key', () => {
  const run = loadGames();
  const text = run('K2_TEXT');
  const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',');
  assert.deepEqual(Object.keys(text.es).sort(), Object.keys(text.en).sort());
  for (const key of Object.keys(text.en)) {
    assert.ok(text.es[key].trim(), `es.${key} is empty`);
    assert.equal(placeholders(text.es[key]), placeholders(text.en[key]), `es.${key} has different {placeholders}`);
  }
});

test('every K-2 level has enough safe and trick messages for a game', () => {
  const run = loadGames();
  const [deck, rounds, maxLevel] = [run('PHISH_DECK'), run('K2_ROUNDS'), run('K2_MAX_LEVEL')];
  for (let level = 1; level <= maxLevel; level++) {
    for (const type of ['trap', 'safe']) {
      const n = deck.filter(m => m.level === level && m.type === type).length;
      assert.ok(n >= Math.ceil(rounds / 2), `level ${level} needs more "${type}" messages (has ${n})`);
    }
  }
});

test('K-2 deals half tricks, half safe, from the current level, without early repeats', () => {
  const run = loadGames();
  const [deck, rounds, maxLevel] = [run('PHISH_DECK'), run('K2_ROUNDS'), run('K2_MAX_LEVEL')];
  for (let level = 1; level <= maxLevel; level++) {
    run(`k2Level = ${level}`);
    const perType = Math.ceil(rounds / 2);
    const smallestPile = Math.min(...['trap', 'safe'].map(t => deck.filter(m => m.level === level && m.type === t).length));
    const seen = new Set();
    for (let g = 0; g < Math.floor(smallestPile / perType); g++) {
      const game = run('dealK2Game()');
      assert.equal(game.length, rounds);
      assert.ok(game.every(m => m.level === level), 'message from the wrong level');
      assert.equal(game.filter(m => m.type === 'trap').length, perType);
      for (const m of game) {
        assert.ok(!seen.has(m.text), `"${m.text}" repeated before its pile ran out`);
        seen.add(m.text);
      }
    }
  }
});

test('3-5: asking straight out finds no trick, and all four tricks are reachable', () => {
  const run = loadGames();
  // copy out of the sandbox so deepEqual compares plain arrays
  const tricksIn = (sel) => [...run(`g35TricksIn(${JSON.stringify(sel)})`)];
  assert.deepEqual(tricksIn({ who: 'student', want: 'pin', how: 'please' }), []);
  assert.deepEqual(tricksIn({ who: 'friend', want: 'pin', how: 'please' }), []);
  const rows = run('G35_ROWS');
  const reachable = new Set();
  for (const who of rows[0].options) for (const want of rows[1].options) for (const how of rows[2].options) {
    tricksIn({ who: who.id, want: want.id, how: how.id }).forEach(t => reachable.add(t));
  }
  assert.deepEqual([...reachable].sort(), Object.keys(run('G35_TRICKS')).sort());
  assert.ok(run('G35_MISSIONS') <= reachable.size, 'more missions than tricks to find');
});

test('3-5: every trick has one right fix and two explained wrong ones', () => {
  const run = loadGames();
  for (const [key, trick] of Object.entries(run('G35_TRICKS'))) {
    for (const field of ['name', 'reply', 'why', 'hint', 'rule']) assert.ok(trick[field], `${key}: missing ${field}`);
    assert.equal(trick.wrong.length, 2, `${key}: needs two wrong fixes`);
    for (const w of trick.wrong) assert.ok(w.text && w.why, `${key}: wrong fix needs text and why`);
  }
});

test('3-5: every choice builds a sentence', () => {
  const run = loadGames();
  for (const row of run('G35_ROWS')) for (const opt of row.options) {
    run(`g35Sel = { who: 'student', want: 'pin', how: 'please' }; g35Sel[${JSON.stringify(row.key)}] = ${JSON.stringify(opt.id)}`);
    const msg = run('g35Message()');
    assert.ok(msg.length > 10 && !msg.includes('undefined'), `bad sentence for ${row.key}=${opt.id}: ${msg}`);
  }
});

test('every onclick in the page calls a function that exists', () => {
  const html = readFileSync(join(ROOT, 'static', 'index.html'), 'utf8');
  const code = readdirSync(JS).filter(f => f.endsWith('.js')).map(f => readFileSync(join(JS, f), 'utf8')).join('\n');
  const called = new Set([...html.matchAll(/on(?:click|error)="(?:event\.stopPropagation\(\);\s*)?([A-Za-z_]\w*)\(/g)].map(m => m[1]));
  for (const fn of called) {
    assert.ok(new RegExp(`function\\s+${fn}\\s*\\(`).test(code), `onclick calls missing function ${fn}()`);
  }
});
