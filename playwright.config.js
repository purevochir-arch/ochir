const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: 'tests', testMatch: /.*\.spec\.js/,
  use: { baseURL: 'http://localhost:8080', viewport: { width: 1400, height: 1000 } },
  webServer: { command: 'npx --yes http-server . -p 8080 -c-1 -s', url: 'http://localhost:8080/simulators/', reuseExistingServer: true, timeout: 60000 }
});
