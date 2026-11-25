// Static checks: every simulator folder has index.html + model.js, and is linked from the hub
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const dir = path.join(__dirname, '..', 'simulators');
const hub = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

for (const name of fs.readdirSync(dir).filter(n => fs.statSync(path.join(dir, n)).isDirectory())) {
  test('simulator "' + name + '" is complete and linked', () => {
    const html = fs.readFileSync(path.join(dir, name, 'index.html'), 'utf8');
    assert.ok(fs.existsSync(path.join(dir, name, 'model.js')), 'model.js missing');
    assert.match(html, /<html lang="mn">/);
    assert.match(html, /<meta name="viewport"/);
    assert.ok(hub.includes('href="' + name + '/"'), 'not linked from simulators/index.html');
  });
}
