// Browser smoke test: open each simulator in Chromium, move a slider, expect no console errors.
const { test, expect } = require('@playwright/test');
const SIMS = ['flotation-plant'];

for (const sim of SIMS) {
  test(sim + ' loads and reacts to input', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto('/simulators/' + sim + '/');
    await expect(page.locator('.kpi').first()).toBeVisible();
    const before = await page.evaluate(() => window.__lastResult.kpi.recovery);
    await page.locator('#s_tRougher').fill('25');
    const after = await page.evaluate(() => window.__lastResult.kpi.recovery);
    expect(after).toBeGreaterThan(before);
    await page.screenshot({ path: 'test-results/' + sim + '.png', fullPage: true });
    expect(errors).toEqual([]);
  });
}
