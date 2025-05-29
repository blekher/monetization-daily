import fs from "fs";
import path from "path";
import { test, expect } from "@playwright/test";

/**
 * Waits for a locator to be visible and clicks it.
 */
export async function waitAndClick(locator, timeout = 1000) {
  try {
    await locator.waitFor({ state: "visible", timeout });
    await locator.click();
  } catch (error) {
    console.log(`Element not visible within ${timeout}ms, skipping click.`);
  }
}

/**
 * Takes a screenshot of a specific element and saves it.
 */
export async function takeElementScreenshot(locator, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const screenshotDir = "./screenshots";

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const filePath = path.join(screenshotDir, `${name}-${timestamp}.png`);
  await expect(locator).toBeVisible();
  await locator.screenshot({ path: filePath });
  console.log(`Element screenshot saved: ${filePath}`);
}

/**
 * Takes a full-page screenshot and saves it.
 */
export async function takeFullPageScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const screenshotDir = "./screenshots";

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const filePath = path.join(screenshotDir, `${name}-${timestamp}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`Full-page screenshot saved: ${filePath}`);
}

/**
 * Saves network logs to a file
 */
export function saveNetworkLogs(logs, filename = "./network_requests.log") {
  const dir = path.dirname(filename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const logText = Array.isArray(logs)
    ? logs.map(l => typeof l === 'string' ? l : JSON.stringify(l)).join("\n")
    : logs;
  fs.writeFileSync(filename, logText, "utf-8");
  console.log(`Network logs saved to: ${filename}`);
}

/**
 * Collects and saves detailed iframe#master22 info to a JSON file
 */

/**
   * @param {import('@playwright/test').Page} page
   * @param {string} iframeId
   */
export async function saveIframeDetailsToFile(page, filename = 'iframe-snapshot.json', iframeId) {
  const iframeLocator = page.locator(`iframe#${iframeId}`);
  const elementHandle = await iframeLocator.elementHandle();

  await iframeLocator.waitFor({ state: 'attached' });
  await iframeLocator.waitFor({ state: 'visible' });

  const box = await iframeLocator.boundingBox();

  const data = {
    src: await iframeLocator.getAttribute('src'),
    sandbox: await iframeLocator.getAttribute('sandbox'),
    referrerPolicy: await iframeLocator.getAttribute('referrerpolicy'),
    allow: await iframeLocator.getAttribute('allow'),
    className: await iframeLocator.getAttribute('class'),
    title: await iframeLocator.getAttribute('title'),
    position: box ? { x: box.x, y: box.y } : null,
    size: box ? { width: box.width, height: box.height } : null,
    styles: await page.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        zIndex: style.zIndex,
        position: style.position,
        pointerEvents: style.pointerEvents
      };
    }, elementHandle),
    intersectionRatio: await page.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const vpWidth = window.innerWidth;
      const vpHeight = window.innerHeight;
      const visibleX = Math.max(0, Math.min(rect.right, vpWidth) - Math.max(rect.left, 0));
      const visibleY = Math.max(0, Math.min(rect.bottom, vpHeight) - Math.max(rect.top, 0));
      const visibleArea = visibleX * visibleY;
      const totalArea = rect.width * rect.height;
      return totalArea > 0 ? Number((visibleArea / totalArea).toFixed(2)) : 0;
    }, elementHandle),
    firstIframeId: await page.locator('iframe').first().getAttribute('id'),
  };

  data.isFirst = data.firstIframeId === 'master22';
  const dir = path.resolve('./snapshots/actual');

  // Ensure the directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('📁 Created missing directory:', dir);
  }
  const outputPath = path.resolve('./snapshots/actual', filename);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`Iframe details saved to: ${outputPath}`);
}

/**
 * Loads and parses a snapshot JSON file
 */
export function loadSnapshot(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * Compares two iframe snapshots with rules and returns array of diffs
 */
export function compareSnapshots(expected, actual, searchQuery) {
  const diffs = [];

  if (actual.size.height < 128) {
    diffs.push(`✗ height is too small: expected at least 128, got ${actual.size.height}`);
  }

  if (!actual.styles || actual.styles.display !== 'block') {
    diffs.push(`✗ iframe is not displayed properly (expected display: block)`);
  }

  const expectedSrcStart = `https://fivem.com.tr/gsearch/results_skpa.html?q=${encodeURIComponent(searchQuery)}&gsc.page=`;
  if (!actual.src.startsWith(expectedSrcStart)) {
    diffs.push(`✗ src mismatch: expected to start with '${expectedSrcStart}', got '${actual.src}'`);
  }

  return diffs;
}

/**
 * Compares and reports iframe snapshot for a given page number
 */
export function runSnapshotTest(pageNumber, searchQuery) {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const expectedPath = path.resolve(__dirname, `../snapshots/expected/iframe-page-${pageNumber}.json`);
  const actualPath = path.resolve(__dirname, `../snapshots/actual/iframe-page-${pageNumber}.json`);

  const expected = loadSnapshot(expectedPath);
  const actual = loadSnapshot(actualPath);
  const diffs = compareSnapshots(expected, actual, searchQuery);

  if (diffs.length > 0) {
    console.error(`Differences found on page ${pageNumber}:`);
    diffs.forEach(diff => console.error(diff));
  }

  expect(diffs.length).toBe(0);
}

/**
 * Generates a detailed snapshot comparison report
 */
export function generateSnapshotReport(expected, actual, searchQuery) {
  const diffs = compareSnapshots(expected, actual, searchQuery);
  return {
    passed: diffs.length === 0,
    diffs
  };
}

/**
 * Extracts computed styles from an element handle
 * @param {ElementHandle} element 
 * @returns {Promise<object>}
 */
export async function getElementStyles(element) {
  return await element.evaluate(el => {
    const style = window.getComputedStyle(el);
    return {
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      color: style.color,
      backgroundColor: style.backgroundColor,
      width: el.offsetWidth,
      height: el.offsetHeight,
      padding: style.padding,
      margin: style.margin,
    };
  });
}

/**
 * Compares two sets of styles with optional tolerance
 * @param {object} expected 
 * @param {object} actual 
 * @param {number} tolerancePx - Tolerance in pixels
 * @returns {string[]} - Array of mismatch messages
 */
export function compareStyles(expected, actual, tolerancePx = 1) {
  const diffs = [];

  const numericKeys = ['width', 'height'];
  for (const key in expected) {
    if (numericKeys.includes(key)) {
      const diff = Math.abs(expected[key] - actual[key]);
      if (diff > tolerancePx) {
        diffs.push(`${key} differs: expected ${expected[key]}, got ${actual[key]}`);
      }
    } else {
      if (expected[key] !== actual[key]) {
        diffs.push(`${key} differs: expected "${expected[key]}", got "${actual[key]}"`);
      }
    }
  }

  return diffs;
}

/**
 * Compares styles of two elements and logs mismatches.
 * @param {Page} page - Playwright page instance
 * @param {Locator} el1 - First element locator
 * @param {Locator} el2 - Second element locator
 * @param {string[]} properties - List of CSS properties to compare
 * @returns {Promise<{ diffs: string[], result: object[] }>}
 */
export async function compareElementStyles(page, el1, el2, properties = []) {
  const getStyles = async (element, props) => {
    return await page.evaluate((el, props) => {
      const styles = getComputedStyle(el);
      const extracted = {};
      for (const prop of props) {
        extracted[prop] = styles.getPropertyValue(prop);
      }
      return extracted;
    }, await element.elementHandle(), props);
  };

  const expectedStyles = await getStyles(el1, properties);
  const actualStyles = await getStyles(el2, properties);

  const diffs = [];
  const report = [];

  for (const prop of properties) {
    const expected = expectedStyles[prop];
    const actual = actualStyles[prop];
    const match = expected === actual;
    report.push({ property: prop, expected, actual, match });
    if (!match) {
      diffs.push(`✗ ${prop}: expected "${expected}", got "${actual}"`);
    }
  }

  return { diffs, result: report };
}

export async function getIframeContent(parentFrame, selector) {
  const frameLocator = parentFrame.locator(selector);
  await frameLocator.waitFor({ state: 'visible', timeout: 15000 });
  const handle = await frameLocator.elementHandle();
  return await handle?.contentFrame();
}
export async function extractAdsData(containerLocator) {
  const adBlocks = await containerLocator.locator('.clicktrackedAd_js').all();
  const adsData = [];

  for (const adBlock of adBlocks) {
    try {
      const getText = (selector) => adBlock.locator(selector).innerText();
      const getAttr = (selector, attr) => adBlock.locator(selector).first().getAttribute(attr);
      const getStyles = (selector, props) =>
        adBlock.locator(selector).evaluate((el, props) => {
          const s = window.getComputedStyle(el);
          return Object.fromEntries(props.map(p => [p, s[p]]));
        }, props);

      adsData.push({
        title: await getText('.favicon-title'),
        domain: await getText('.favicon-domain'),
        link: await getAttr('a', 'href'),
        description: await getText('.styleable-description'),
        iconUrl: await getAttr('img.rms_img', 'src'),
        titleStyles: await getStyles('.favicon-title', ['display', 'fontSize', 'color']),
        descriptionStyles: await getStyles('.styleable-description', ['display', 'fontSize', 'color']),
        iconStyles: await getStyles('img.rms_img', ['display', 'width', 'height']),
      });
    } catch (error) {
      console.warn('⚠️ Failed to extract ad block:', error);
    }
  }

  return { adsData, count: adsData.length };
}

export const dataCollector = test;

export async function extractMatchingSearchResults(page, searchQuery, maxToCheck = 5) {
  const queryWords = searchQuery.toLowerCase().split(/\s+/);
  const matched = [];

  const rsoLocator = page.locator('#rso');
  await rsoLocator.waitFor({ state: 'visible', timeout: 10000 });

  const resultBlocks = rsoLocator.locator('div.yuRUbf');
  const total = await resultBlocks.count();

  for (let i = 0; i < Math.min(total, maxToCheck); i++) {
    const block = resultBlocks.nth(i);
    const titleEl = block.locator('h3');
    const linkEl = block.locator('a');
    const descEl = page.locator('#rso .VwiC3b').nth(i);

    const [title, link, description] = await Promise.all([
      titleEl.innerText().catch(() => ''),
      linkEl.getAttribute('href').catch(() => ''),
      descEl.innerText().catch(() => '')
    ]);

    const combined = `${title} ${description}`.toLowerCase();
    const isMatch = queryWords.every(word => combined.includes(word));

    if (!isMatch) continue;

    const [titleStyles, iconStyles] = await Promise.all([
      titleEl.evaluate(el => {
        const s = window.getComputedStyle(el);
        return {
          display: s.display,
          fontSize: s.fontSize,
          color: s.color
        };
      }).catch(() => ({})),

      block.locator('img').evaluate(el => {
        const s = window.getComputedStyle(el);
        return {
          display: s.display,
          width: s.width,
          height: s.height
        };
      }).catch(() => ({}))
    ]);

    let descriptionStyles = {};
    const descHandle = await descEl.elementHandle();
    if (descHandle) {
      descriptionStyles = await descHandle.evaluate(el => {
        const s = window.getComputedStyle(el);
        return {
          display: s.display,
          fontSize: s.fontSize,
          color: s.color
        };
      }).catch(() => ({}));
    }

    matched.push({
      title,
      link,
      description,
      titleStyles,
      descriptionStyles,
      iconStyles
    });
  }

  return matched;
}
export async function simulateHumanBehavior(page) {
  // Random delays between actions
  const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  
  // Random mouse movements
  const moveMouseRandomly = async () => {
    const x = Math.floor(Math.random() * 800);
    const y = Math.floor(Math.random() * 600);
    await page.mouse.move(x, y);
    await page.waitForTimeout(randomDelay(100, 300));
  };

  // Random scrolling
  const scrollRandomly = async () => {
    const scrollAmount = randomDelay(-300, 300);
    await page.mouse.wheel(0, scrollAmount);
    await page.waitForTimeout(randomDelay(200, 500));
  };

  // Simulate reading behavior
  const simulateReading = async () => {
    await page.waitForTimeout(randomDelay(1000, 2000));
    await scrollRandomly();
    await page.waitForTimeout(randomDelay(500, 1000));
  };

  // Main sequence of human-like actions
  try {
    // Initial delay before starting
    await page.waitForTimeout(randomDelay(800, 1500));

    // Move mouse to search box
    await page.mouse.move(180, 280);
    await page.waitForTimeout(randomDelay(200, 400));

    // Random mouse movements
    for (let i = 0; i < 3; i++) {
      await moveMouseRandomly();
    }

    // Simulate reading the page
    await simulateReading();

    // Random scrolling
    for (let i = 0; i < 2; i++) {
      await scrollRandomly();
    }

    // Final delay before proceeding
    await page.waitForTimeout(randomDelay(500, 1000));
  } catch (error) {
    console.warn('⚠️ Error during human behavior simulation:', error);
  }
}

/**
 * Retries an operation multiple times with exponential backoff
 * @param {Function} operation - Async function to retry
 * @param {string} operationName - Name of the operation for logging
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} initialDelay - Initial delay between retries in ms
 * @returns {Promise<any>} - Result of the operation
 */
export async function retryOperation(operation, operationName, maxRetries = 3, initialDelay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) {
        console.error(`❌ ${operationName} failed after ${maxRetries} attempts:`, error);
        throw error;
      }
      
      const delay = initialDelay * Math.pow(2, attempt - 1);
      console.log(`⚠️ ${operationName} attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}