# Ochir — AI Command Center

[![CI](https://github.com/purevochir-arch/ochir/actions/workflows/ci.yml/badge.svg)](https://github.com/purevochir-arch/ochir/actions/workflows/ci.yml)
[![Uptime](https://github.com/purevochir-arch/ochir/actions/workflows/uptime.yml/badge.svg)](https://github.com/purevochir-arch/ochir/actions/workflows/uptime.yml)

**Dr. Togtokhbaatar Purev-Ochir** · Associate Professor, GMIT (МГТИС) · mineral processing, flotation, hydrometallurgy, critical minerals.

This repo is where my AI team (Esther, Nora, Leo, Jacob, Emma, Sara, Ivan, Lia, Max) keeps its instructions, skills and the interactive process simulators I use in teaching.

| | |
|---|---|
| 🧪 Live simulators | https://purevochir-arch.github.io/ochir/simulators/ |
| 🎓 Teaching site | https://monprocess.org |
| 🏔️ Enza Tours | https://mongoliantour.guide |
| 📖 Монгол заавар | [docs/zaavar-mn.md](docs/zaavar-mn.md) |

## What's inside
- `simulators/` — interactive plant simulators (first: copper flotation rougher–scavenger–cleaner circuit with recycle)
- `CLAUDE.md` — rules Claude follows in this repo
- `.claude/skills/` — know-how: simulator builder, Mongolian writing, release check
- `.claude/agents/` — the named team as Claude Code subagents
- `.github/workflows/` — automatic tests, website deploy, uptime check every 6 h
- `tests/` — math tests (mass balance closes to 1e-9 t/h), browser tests, website checks

## Run locally
```bash
npm install
npm test            # math + structure
npm run test:e2e    # opens every simulator in Chromium
npm run check:sites # are the websites up?
npm run serve       # http://localhost:8080
```
