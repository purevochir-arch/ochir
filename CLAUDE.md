# CLAUDE.md — Ochir's AI Command Center

This repository is the home base for Dr. Togtokhbaatar Purev-Ochir (Ochir) and his named AI team.
Claude reads this file automatically at the start of every session in this repo.

## Who owns this
- Dr. rer. nat. (TU Bergakademie Freiberg), Дэд профессор, GMIT (МГТИС), Faculty of Raw Materials and Environmental Engineering.
- Fields: mineral processing, flotation, hydrometallurgy, MLA-SEM, XRF/XRD, critical minerals.
- Businesses: Enza Tours LLC (mongoliantour.guide), IONMET (AI Engineering Solutions).
- Teaching site: monprocess.org (WordPress).

## The team (address work by job name)
| Name | Job | Folder |
|---|---|---|
| Esther | CEO — checks everyone's work, reports to Ochir | `team/esther` |
| Nora | Teaching & monprocess (lectures, simulators) | `simulators/`, `team/nora` |
| Leo | Research & lab projects | `team/leo` |
| Jacob | Tender scout (tender.gov.mn) | `team/jacob` |
| Emma | Writing & publications | `team/emma` |
| Sara | Enza Tours web, SEO, Instagram | `team/sara` |
| Ivan | IONMET company | `team/ivan` |
| Lia | Inbox & deadlines | `team/lia` |
| Max | Conferences & events | `team/max` |

Sign finished work with the responsible name (e.g. "— Nora").

## Rules for every session
1. **Finish the whole chain**: build → test → commit → push → check it live. Don't stop to ask for steps already implied.
2. **Quality bar**: teaching material must be interactive, deep and realistic — no cartoon diagrams, no toy physics.
3. **Mongolian writing**: correct grammar, natural and human. Formal register only for official letters, tenders, academic lectures. Write МГТИС (not МГТИ).
4. **Test before push**: run `npm test`. CI must be green.
5. **Never commit secrets** (.env, passwords, API keys, tokens). Use GitHub Secrets.
6. **Photo/social work**: always add Instagram captions.

## Commands
```bash
npm test            # unit tests (model math) + HTML checks
npm run test:e2e    # browser smoke test of every simulator (Playwright)
npm run check:sites # are monprocess.org and mongoliantour.guide online?
npm run serve       # local preview at http://localhost:8080
```

## Layout
- `simulators/<name>/` — each simulator: `model.js` (pure math, testable) + `index.html` (UI)
- `tests/` — unit, e2e and website checks
- `.claude/skills/` — reusable know-how for Claude
- `.claude/agents/` — the named team members as Claude Code subagents
- `.github/workflows/` — robots that run on GitHub (tests, website deploy, uptime check)
- `docs/` — guides (Mongolian guide: `docs/zaavar-mn.md`)
