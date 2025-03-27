import fs from "fs";
import path from "path";
import { expect } from "@playwright/test";

/**
 * Waits for a locator to be visible and clicks it.
 * @param {Locator} locator - Playwright locator object
 * @param {number} timeout - Time to wait for the element (ms). Default: 1 sec.
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
 * Takes a screenshot of a specific element and saves it with a timestamp.
 * @param {Locator} locator - Playwright locator object
 * @param {string} name - Base name for the screenshot file
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
 * Takes a full-page screenshot and saves it with a timestamped filename.
 * @param {Page} page - Playwright page object
 * @param {string} name - Base name for the screenshot file
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
 * @param {string[]} logs - Array of log strings
 * @param {string} filename - Path to output file
 */
export function saveNetworkLogs(logs, filename = "./network_requests.log") {
  const logText = logs.join("\n");
  fs.writeFileSync(filename, logText, "utf-8");
  console.log(`Network logs saved to: ${filename}`);
}

/**
 * Collects detailed metrics and attributes from iframe#master22 and saves them to a JSON file.
 * @param {import('@playwright/test').Page} page 
 * @param {string} filename - Name of the output file
 */
export async function saveIframeDetailsToFile(page, filename) {
    const iframe = page.locator('iframe#master22');
  
    await iframe.waitFor({ state: 'attached' });
    await iframe.waitFor({ state: 'visible' });
  
    const elementHandle = await iframe.elementHandle();
    const box = await iframe.boundingBox();
  
    const [src, sandbox, referrerPolicy, allow, className, title] = await Promise.all([
      iframe.getAttribute('src'),
      iframe.getAttribute('sandbox'),
      iframe.getAttribute('referrerpolicy'),
      iframe.getAttribute('allow'),
      iframe.getAttribute('class'),
      iframe.getAttribute('title')
    ]);
  
    const styles = await page.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        zIndex: style.zIndex,
        position: style.position,
        pointerEvents: style.pointerEvents
      };
    }, elementHandle);
  
    const intersectionRatio = await page.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const vpWidth = window.innerWidth;
      const vpHeight = window.innerHeight;
      const visibleX = Math.max(0, Math.min(rect.right, vpWidth) - Math.max(rect.left, 0));
      const visibleY = Math.max(0, Math.min(rect.bottom, vpHeight) - Math.max(rect.top, 0));
      const visibleArea = visibleX * visibleY;
      const totalArea = rect.width * rect.height;
      return totalArea > 0 ? parseFloat((visibleArea / totalArea).toFixed(2)) : 0;
    }, elementHandle);
  
    const firstIframeId = await page.locator('iframe').first().getAttribute('id');
    const isFirst = firstIframeId === 'master22';
  
    const details = {
      src,
      sandbox,
      referrerPolicy,
      allow,
      className,
      title,
      position: box ? { x: box.x, y: box.y } : null,
      size: box ? { width: box.width, height: box.height } : null,
      styles,
      intersectionRatio,
      firstIframeId,
      isFirst
    };
  
    const outputPath = path.resolve('./snapshots/iframe-details', filename);
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }
  
    fs.writeFileSync(outputPath, JSON.stringify(details, null, 2), 'utf-8');
    console.log(`Iframe details saved to: ${outputPath}`);
  }