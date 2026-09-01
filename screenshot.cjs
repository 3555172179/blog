const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const shots = [
    { name: 'zh-home-desktop', url: 'http://localhost:4321/', width: 1280, height: 1200 },
    { name: 'zh-home-mobile', url: 'http://localhost:4321/', width: 375, height: 900 },
    { name: 'en-home-desktop', url: 'http://localhost:4321/en/', width: 1280, height: 1200 },
    { name: 'zh-blog-desktop', url: 'http://localhost:4321/blog/', width: 1280, height: 900 },
  ];

  for (const s of shots) {
    await page.setViewportSize({ width: s.width, height: s.height });
    await page.goto(s.url);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(__dirname, `${s.name}.png`), fullPage: true });
  }

  await browser.close();
  console.log('Screenshots saved');
})();
