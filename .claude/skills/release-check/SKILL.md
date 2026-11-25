---
name: release-check
description: Use before pushing or publishing anything from this repo — the checklist Esther runs so nothing broken goes live.
---

# Release check (Esther)

1. `npm test` → all green.
2. `npm run test:e2e` → every simulator loads, no console errors.
3. `git diff --stat` → no secrets, no huge binaries (> 20 MB → use releases or LFS).
4. New simulator is linked from `simulators/index.html`.
5. Commit message: what + why, signed with the bot name.
6. After push: open the Actions tab — CI green? Then open the live GitHub Pages URL and click through.
7. Report to Ochir in 3 lines (Mongolian): what changed, link, anything he must do.
