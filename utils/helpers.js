import fs from 'fs';
import path from 'path';

/**
 * Waits for a locator to be visible and clicks it.
 * @param {Locator} locator - Playwright locator object
 * @param {number} timeout - Time to wait for the element (ms). Default: 10 sec.
 */
export async function waitAndClick(locator, timeout = 1000) {
    try {
        await locator.waitFor({ state: 'visible', timeout });
        await locator.click();
    } catch (error) {
        console.log(`Element not visible within ${timeout}ms, skipping click.`);
    }
}

export async function takeNamedScreenshot(page, name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotDir = './screenshots';

    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir);
    }

    const filePath = path.join(screenshotDir, `${name}-${timestamp}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`Screenshot saved: ${filePath}`);
}