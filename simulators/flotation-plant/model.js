/*
 * Copper flotation plant model — Rougher / Scavenger / Cleaner with recycle.
 * Pure math, no DOM. Works in the browser (window.FlotationModel) and in Node (require).
 *
 * Kinetics: first-order flotation in a bank of N perfectly mixed cells in series
 *   R = 1 - (1 + k·τ)^(-N),  τ = t / N   (t = total bank residence time, min)
 * Value mineral (chalcopyrite, CuFeS2, 34.6 % Cu) is split into a fast-floating, a slow-floating
 * and a non-floating (locked) fraction. Gangue reports to froth by true flotation + entrainment
 * lumped into a small rate constant per stage.
 * Circuit: fresh feed + recycle -> Rougher. Rougher conc -> Cleaner. Rougher tail -> Scavenger.
 * Cleaner tail and scavenger conc return to the rougher feed. Final conc = cleaner conc,
 * final tailings = scavenger tail. The recycle is solved by fixed-point iteration.
 * — Nora
 */
(function (root) {
  'use strict';

  var CU_IN_CPY = 0.3463; // mass fraction Cu in chalcopyrite

  var DEFAULTS = {
    feedTph: 1500,        // fresh feed, t/h dry solids
    headCu: 0.50,         // % Cu in fresh feed
    fastFrac: 0.70,       // fraction of chalcopyrite that floats fast
    slowFrac: 0.24,       // fraction that floats slowly (rest is locked / non-floating)
    kFast: 1.20,          // 1/min
    kSlow: 0.12,          // 1/min
    kGangueRough: 0.012,  // 1/min, gangue in rougher/scavenger (entrainment)
    kGangueClean: 0.004,  // 1/min, gangue in cleaner (wash water, deeper froth)
    cleanerKFactor: 0.85, // cleaner rate constants relative to rougher (lower solids, coarser froth)
    tRougher: 12,         // min
    tScav: 10,            // min
    tCleaner: 14,         // min
    nRougher: 6,          // cells
    nScav: 5,
    nCleaner: 4,
    cuPrice: 9500,        // USD per t Cu
    payable: 0.965        // payable fraction of Cu in concentrate
  };

  function bankRecovery(k, t, n) {
    if (t <= 0 || k <= 0) return 0;
    var tau = t / n;
    return 1 - Math.pow(1 + k * tau, -n);
  }

  // stream = [fast, slow, locked, gangue] in t/h
  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]]; }
  function total(s) { return s[0] + s[1] + s[2] + s[3]; }
  function cuTph(s) { return (s[0] + s[1] + s[2]) * CU_IN_CPY; }
  function grade(s) { var m = total(s); return m > 0 ? 100 * cuTph(s) / m : 0; }

  function stage(feed, rates, t, n) {
    var conc = [], tail = [];
    for (var i = 0; i < 4; i++) {
      var r = bankRecovery(rates[i], t, n);
      conc.push(feed[i] * r);
      tail.push(feed[i] * (1 - r));
    }
    return { conc: conc, tail: tail };
  }

  function simulate(input) {
    var p = {};
    for (var key in DEFAULTS) p[key] = (input && input[key] !== undefined) ? Number(input[key]) : DEFAULTS[key];

    var cpy = p.feedTph * (p.headCu / 100) / CU_IN_CPY;           // t/h chalcopyrite
    var lockedFrac = Math.max(0, 1 - p.fastFrac - p.slowFrac);
    var fresh = [cpy * p.fastFrac, cpy * p.slowFrac, cpy * lockedFrac, p.feedTph - cpy];

    var rough = [p.kFast, p.kSlow, 0, p.kGangueRough];
    var clean = [p.kFast * p.cleanerKFactor, p.kSlow * p.cleanerKFactor, 0, p.kGangueClean];

    var recycle = [0, 0, 0, 0], R, S, C, iter = 0, err = 1;
    while (iter < 2000 && err > 1e-12) {
      var roughFeed = add(fresh, recycle);
      R = stage(roughFeed, rough, p.tRougher, p.nRougher);
      S = stage(R.tail, rough, p.tScav, p.nScav);
      C = stage(R.conc, clean, p.tCleaner, p.nCleaner);
      var next = add(C.tail, S.conc);
      err = Math.abs(total(next) - total(recycle)) / Math.max(1e-9, p.feedTph);
      recycle = next;
      iter++;
    }
    var roughFeedFinal = add(fresh, recycle);

    var conc = C.conc, tails = S.tail;
    var concTph = total(conc);
    var recovery = 100 * cuTph(conc) / cuTph(fresh);
    var revenue = cuTph(conc) * p.payable * p.cuPrice; // USD/h (before TC/RC and freight)

    function view(s) { return { tph: total(s), cuPct: grade(s), cuTph: cuTph(s) }; }

    return {
      params: p,
      converged: err <= 1e-12,
      iterations: iter,
      streams: {
        fresh: view(fresh),
        rougherFeed: view(roughFeedFinal),
        rougherConc: view(R.conc),
        rougherTail: view(R.tail),
        scavConc: view(S.conc),
        cleanerTail: view(C.tail),
        recycle: view(recycle),
        concentrate: view(conc),
        tailings: view(tails)
      },
      kpi: {
        concGrade: grade(conc),
        recovery: recovery,
        massPull: 100 * concTph / p.feedTph,
        enrichment: grade(conc) / p.headCu,
        circulatingLoad: 100 * total(recycle) / p.feedTph,
        tailGrade: grade(tails),
        revenueUsdPerHour: revenue,
        balanceErrorTph: p.feedTph - concTph - total(tails),
        cuBalanceErrorTph: cuTph(fresh) - cuTph(conc) - cuTph(tails)
      }
    };
  }

  // grade-recovery curve: sweep the rougher residence time
  function gradeRecoveryCurve(input, tMin, tMax, steps) {
    var out = [];
    for (var i = 0; i <= steps; i++) {
      var t = tMin + (tMax - tMin) * i / steps;
      var o = {}; for (var k in input) o[k] = input[k];
      o.tRougher = t;
      var r = simulate(o);
      out.push({ t: t, grade: r.kpi.concGrade, recovery: r.kpi.recovery });
    }
    return out;
  }

  var api = { DEFAULTS: DEFAULTS, CU_IN_CPY: CU_IN_CPY, bankRecovery: bankRecovery, simulate: simulate, gradeRecoveryCurve: gradeRecoveryCurve };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FlotationModel = api;
})(typeof window !== 'undefined' ? window : this);
