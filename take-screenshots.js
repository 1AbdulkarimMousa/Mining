/**
 * Mobile Screenshot Automation Script
 * Captures mobile view screenshots of all website pages
 * Uses Puppeteer with iPhone 12 Pro viewport
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Configuration
const CONFIG = {
  baseUrl: 'http://localhost:3000',
  outputDir: './screenshots',
  viewport: {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  },
  pages: [
    { name: 'home', path: '/index.html' },
    { name: 'about', path: '/about.html' },
    { name: 'projects', path: '/projects.html' },
    { name: 'operations', path: '/operations.html' },
    { name: 'investment', path: '/investment.html' },
    { name: 'team', path: '/team.html' },
    { name: 'sustainability', path: '/sustainability.html' },
    { name: 'contact', path: '/contact.html' },
    { name: 'terms', path: '/terms-of-service.html' },
    { name: 'privacy', path: '/privacy-policy.html' }
  ]
};

async function takeScreenshots() {
  // Create output directory
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  console.log('🚀 Starting mobile screenshot capture...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set mobile viewport
  await page.setViewport(CONFIG.viewport);

  // Set mobile user agent
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1');

  for (const pageConfig of CONFIG.pages) {
    const url = CONFIG.baseUrl + pageConfig.path;
    console.log(`📸 Capturing: ${pageConfig.name}`);

    try {
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Wait for animations to complete
      await new Promise(r => setTimeout(r, 1000));

      // Take full page screenshot
      const screenshotPath = path.join(CONFIG.outputDir, `${pageConfig.name}-mobile-full.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });
      console.log(`   ✅ Full page saved: ${screenshotPath}`);

      // Take viewport screenshot (above the fold)
      const viewportPath = path.join(CONFIG.outputDir, `${pageConfig.name}-mobile-viewport.png`);
      await page.screenshot({
        path: viewportPath,
        fullPage: false
      });
      console.log(`   ✅ Viewport saved: ${viewportPath}`);

      // Scroll to bottom and capture footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(r => setTimeout(r, 500));
      const footerPath = path.join(CONFIG.outputDir, `${pageConfig.name}-mobile-footer.png`);
      await page.screenshot({
        path: footerPath,
        fullPage: false
      });
      console.log(`   ✅ Footer saved: ${footerPath}`);

    } catch (error) {
      console.error(`   ❌ Error capturing ${pageConfig.name}: ${error.message}`);
    }
  }

  // Test mobile menu
  console.log('\n📸 Capturing mobile menu state...');
  try {
    await page.goto(CONFIG.baseUrl + '/index.html', { waitUntil: 'networkidle0' });

    // Click hamburger menu if exists
    const menuToggle = await page.$('.navbar-toggler-ziyo, .mobile-menu-toggle');
    if (menuToggle) {
      await menuToggle.click();
      await new Promise(r => setTimeout(r, 500));
      await page.screenshot({
        path: path.join(CONFIG.outputDir, 'mobile-menu-open.png'),
        fullPage: false
      });
      console.log('   ✅ Mobile menu captured');
    }
  } catch (error) {
    console.error(`   ❌ Error capturing menu: ${error.message}`);
  }

  await browser.close();
  console.log('\n✨ Screenshot capture complete!');
  console.log(`📁 Screenshots saved to: ${path.resolve(CONFIG.outputDir)}`);
}

takeScreenshots().catch(console.error);
