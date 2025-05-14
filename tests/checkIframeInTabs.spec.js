import { test } from './fixtures.js';
import { expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { GooglePage } from '../pages/googlePage.js';
import { SearchResultsPage } from '../pages/searchResultsPage.js';
import { testData } from './testData.js';
import {
  getIframeContent,
  extractAdsData,
  extractMatchingSearchResults,
  simulateHumanBehavior
} from '../utils/helpers.js';

test('Checking the presence of monetization iframes on the "All" and "Web" tabs.', { timeout: 120000 }, async ({ page }, testInfo) => {
    console.log('⏱ Test started...');
    const startTime = Date.now();
  
    const googlePage = new GooglePage(page);
    const searchResultsPage = new SearchResultsPage(page);

  
    try {
        await test.step('Navigate to Google and simulate user behavior', async () => {
            console.log('🌐 Navigating to Google...');
            await googlePage.navigate();
            console.log('🤖 Simulating human behavior...');
            // await simulateHumanBehavior(page);
          });

          await test.step('Perform Google search', async () => {
            console.log('🔍 Performing search...');
            await googlePage.selectModule();
            await googlePage.search(testData.searchQuery);
            await googlePage.waitForSearchResults();
            await googlePage.closeLocationPopup();
            console.log('✅ Search completed');
          });

/////////////////////////////////////////////
await searchResultsPage.validateIframe();
console.log('Validate frame in "all" tab passed');

await searchResultsPage.clickMoreButton();
console.log('Click "more" button');

await searchResultsPage.clickWebButton();
console.log('Click web button');

await searchResultsPage.validateIframe();
console.log('Validate frame in "web" tab passed');      

/////////////////////////////////////////

    } catch (error) {
        console.error('❌ Test failed:', error);
        throw error;
      } finally {
        const duration = Date.now() - startTime;
        console.log('⏱ Test duration (ms):', duration);
        console.log('✅ Test finished');
      }
    });