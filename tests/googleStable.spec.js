import { test, expect, chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GooglePage } from '../pages/GooglePage.js';
import { ExtensionsPage } from '../pages/ExtensionsPage.js';
import { SearchResultsPage } from '../pages/SearchResultsPage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const extensionPath = path.resolve(__dirname, '../tests/monetization_test');

const logFilePath = './network_requests.log';
const pageScreenshotPath = './page_screenshot.png';

test('Testing Google stable module', async ({}) => {
    const browser = await chromium.launchPersistentContext('', {
        headless: false,
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
            `--disable-blink-features=AutomationControlled`
        ]
    });

    const page = await browser.newPage();
    const networkLogs = [];

    page.on('request', request => {
        networkLogs.push(`Request: ${request.method()} ${request.url()}`);
    });

    page.on('response', response => {
        networkLogs.push(`Response: ${response.status()} ${response.url()}`);
    });

    // Check if the extension is installed
    const extensionsPage = new ExtensionsPage(page);
    await extensionsPage.navigate();
    await extensionsPage.verifyExtensionInstalled();

    // Navigate to Google
    const googlePage = new GooglePage(page);
    await googlePage.navigate();
    await googlePage.selectModule();
    await googlePage.search('rent car');
    await googlePage.waitForSearchResults();
    await googlePage.closeLocationPopup();

   // Search for iframe id="master22""
    const searchResultsPage = new SearchResultsPage(page);
    await searchResultsPage.checkForIframe();

    // Take a screenshot of the page
    await page.screenshot({ path: pageScreenshotPath, fullPage: true });

    //  Save network requests to file
    fs.writeFileSync(logFilePath, networkLogs.join('\n'), 'utf-8');

    await browser.close();
});