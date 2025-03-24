import { expect, chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GooglePage } from '../pages/GooglePage.js';
import { ExtensionsPage } from '../pages/ExtensionsPage.js';
import { SearchResultsPage } from '../pages/SearchResultsPage.js';
import { takeNamedScreenshot } from '../utils/helpers.js';
import { test } from './fixtures.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//const extensionPath = path.resolve(__dirname, '../tests/monetization_test');
const logFilePath = './network_requests.log';

test('Testing Google stable module', async ({ page }) => {
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
    await takeNamedScreenshot(page, 'results-page-1'); // Take a screenshot of the page
    
    // Go to the next results page
    await googlePage.goToSearchPage(2);  

    // Search for iframe id="master22""
    await searchResultsPage.checkForIframe(); 
    await takeNamedScreenshot(page, 'results-page-2'); // Take a screenshot of the page
    
    //  Save network requests to file
    fs.writeFileSync(logFilePath, networkLogs.join('\n'), 'utf-8');
    console.log('Browser closed');
});