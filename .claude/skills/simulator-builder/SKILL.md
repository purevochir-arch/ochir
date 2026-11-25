---
name: simulator-builder
description: Use when building or changing a process simulator in simulators/ (flotation, leaching, grinding, thickening, reactors) — sets the folder layout, model/UI split, physics standard and the tests every simulator must pass.
---

# Simulator builder

## Layout (one folder per simulator)
```
simulators/<name>/
  model.js     # pure math only — no DOM. Works in browser (window.<Name>Model) and Node (module.exports)
  index.html   # UI: sliders, live flowsheet, charts, KPI tiles. Loads ./model.js
tests/<name>.test.js   # node:test unit tests of model.js
```
Add the simulator to `simulators/index.html` (the hub) and to `tests/e2e.spec.js` list.

## Physics standard (not "child play")
- Use published model forms: first-order flotation kinetics R = R∞(1 − e^(−kt)) with
  fast/slow floating fractions; Bond's law for grinding; shrinking-core for leaching; CSTR/PFR for reactors.
- Mass balance must close: feed = concentrate + tailings for solids AND each metal (test it to 1e-9).
- Show units (SI, t/h, %, min). Show grade, recovery, enrichment ratio, NSR where relevant.
- Default values must be realistic for Mongolian porphyry Cu (Erdenet-like) unless the lecture says otherwise.

## UI standard
- Realistic flowsheet (cells, launders, streams with tonnage/grade labels), consistent font sizes, dark/light safe.
- Every slider updates the whole balance instantly. Include a "Reset" and an "Explain" panel (formal academic Mongolian + English).

## Tests every simulator must pass
1. Mass balance closes (solids and metal).
2. Recovery between 0 and 100 %, grade ≤ mineral grade limit.
3. Monotonic sanity: longer residence time → recovery does not decrease.
4. Page loads in Chromium with zero console errors (`npm run test:e2e`).
