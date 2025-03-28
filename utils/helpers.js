import fs from "fs";
import path from "path";
import { expect } from "@playwright/test";

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
  const logText = logs.join("\n");
  fs.writeFileSync(filename, logText, "utf-8");
  console.log(`Network logs saved to: ${filename}`);
}

/**
 * Collects and saves detailed iframe#master22 info to a JSON file
 */
export async function saveIframeDetailsToFile(page, filename = 'iframe-snapshot.json') {
  const iframeLocator = page.locator('iframe#master22');
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