// Unit tests for the flotation plant model — run with: npm test
const test = require('node:test');
const assert = require('node:assert');
const M = require('../simulators/flotation-plant/model.js');

test('bank recovery: limits and N-cell formula', () => {
  assert.strictEqual(M.bankRecovery(1, 0, 4), 0);
  const r1 = M.bankRecovery(1, 10, 1);
  assert.ok(Math.abs(r1 - (1 - 1 / 11)) < 1e-12);
  // more cells at the same total time => higher recovery (closer to plug flow)
  assert.ok(M.bankRecovery(0.5, 10, 8) > M.bankRecovery(0.5, 10, 2));
  // plug-flow limit 1 - e^(-kt)
  assert.ok(Math.abs(M.bankRecovery(0.5, 10, 100000) - (1 - Math.exp(-5))) < 1e-4);
});

test('default plant converges and closes mass balance', () => {
  const r = M.simulate();
  assert.ok(r.converged);
  assert.ok(Math.abs(r.kpi.balanceErrorTph) < 1e-6, 'solids balance');
  assert.ok(Math.abs(r.kpi.cuBalanceErrorTph) < 1e-6, 'Cu balance');
});

test('default plant gives realistic porphyry-Cu numbers', () => {
  const k = M.simulate().kpi;
  assert.ok(k.concGrade > 15 && k.concGrade < 34.6, 'grade ' + k.concGrade);
  assert.ok(k.recovery > 80 && k.recovery < 96, 'recovery ' + k.recovery);
  assert.ok(k.tailGrade < 0.1, 'tail grade ' + k.tailGrade);
});

test('grade never exceeds pure chalcopyrite, recovery within 0–100 %', () => {
  for (const kG of [0, 0.001, 0.05]) for (const t of [1, 10, 40]) {
    const k = M.simulate({ kGangueRough: kG, kGangueClean: kG / 3, tRougher: t }).kpi;
    assert.ok(k.concGrade <= 34.63 + 1e-9);
    assert.ok(k.recovery >= 0 && k.recovery <= 100);
  }
});

test('longer rougher time never lowers recovery', () => {
  const c = M.gradeRecoveryCurve(M.DEFAULTS, 2, 30, 28);
  for (let i = 1; i < c.length; i++) assert.ok(c[i].recovery >= c[i - 1].recovery - 1e-9);
});

test('balance closes across random operating points', () => {
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 200; i++) {
    const r = M.simulate({ feedTph: 500 + 3500 * rnd(), headCu: 0.2 + 1.3 * rnd(), tRougher: 2 + 28 * rnd(), tScav: 30 * rnd(), tCleaner: 2 + 28 * rnd(), nRougher: 1 + Math.floor(12 * rnd()) });
    assert.ok(r.converged);
    assert.ok(Math.abs(r.kpi.balanceErrorTph) < 1e-6);
  }
});
