import fs from 'fs';
import path from 'path';
import { expect } from '@playwright/test';

/**
 * Waits for a locator to be visible and clicks it.
 * @param {Locator} locator - Playwright locator object
 * @param {number} timeout - Time to wait for the element (ms). Default: 1 sec.
 */
export async function waitAndClick(locator, timeout = 1000) {
    try {
        await locator.waitFor({ state: 'visible', timeout });
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
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotDir = './screenshots';

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
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotDir = './screenshots';

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
export function saveNetworkLogs(logs, filename = './network_requests.log') {
    const logText = logs.join('\n');
    fs.writeFileSync(filename, logText, 'utf-8');
    console.log(`Network logs saved to: ${filename}`);
}