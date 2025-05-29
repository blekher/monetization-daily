import { test } from '../fixtures.js';
import { expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { GooglePage } from '../../pages/googlePage.js';
import { GoogleSearchResultsPage } from '../../pages/googleSearchResultsPage.js';
import { testData } from '../testData.js';
import {
  getIframeContent,
  extractAdsData,
  extractMatchingSearchResults,
  simulateHumanBehavior
} from '../../utils/helpers.js';

// test('Check hover on ads', { timeout: 120000 }, async ({ page }, testInfo) => {
//     console.log('⏱ Test started...');
//     const startTime = Date.now();
  
//     const googlePage = new GooglePage(page, 'google_stable', 'master22');
//     const googleSearchResultsPage = new GoogleSearchResultsPage(page, 'master22');

  
//     try {
//         await test.step('Navigate to Google and simulate user behavior', async () => {
//             console.log('🌐 Navigating to Google...');
//             await googlePage.navigate();
//             console.log('🤖 Simulating human behavior...');
//             // await simulateHumanBehavior(page);
//           });

//           await test.step('Perform Google search', async () => {
//             console.log('🔍 Performing search...');
//             await googlePage.selectModule();
//             await googlePage.search(testData.searchQuery);
//             await googlePage.waitForSearchResults();
//             // await googlePage.closeLocationPopup();
//             console.log('✅ Search completed');
//           });

/////////////////////////////////////////////

      // await googleSearchResultsPage.hoverAdsTitle();
      // console.log('test Hover title passed!')

      // await googleSearchResultsPage.hoverAdsFavicon();
      // console.log('test Hover favicon passed!')

      // await googleSearchResultsPage.hoverAdsFaviconTitle();
      // console.log('test Hover favicon title passed!')

      // await googleSearchResultsPage.hoverAdsFaviconDomain();
      // console.log('test Hover favicon domain passed!')

/////////////////////////////////////////

    // } catch (error) {
    //     console.error('❌ Test failed:', error);
    //     throw error;
    //   } finally {
    //     const duration = Date.now() - startTime;
    //     console.log('⏱ Test duration (ms):', duration);
    //     console.log('✅ Test finished');
    //   }
    // });


///////////////////////////////////////////////////////////////////////

let startTime;
let googlePage;
let googleSearchResultsPage;

test.describe.serial('C700 - Check hover on ads', () => {


  test.beforeEach(async ({ page }) => {
    startTime = Date.now();
    googlePage = new GooglePage(page, 'google_stable', 'master22');
    googleSearchResultsPage = new GoogleSearchResultsPage(page, 'master22');
    console.log('🌐 Navigating to Google...');
    await googlePage.navigate();
    await googlePage.selectModule();
    await googlePage.search(testData.searchQuery);
    await googlePage.waitForSearchResults();
    console.log('🔍 Performing search...');
    // await googlePage.closeLocationPopup();
    console.log('✅ Search completed');
  });

  test.afterEach(() => {
    const duration = Date.now() - startTime;
    console.log('⏱ Test duration (ms):', duration);
  });

  test('C700 – hover на favicon-title підкреслює styleable-title', async () => {
  // const googlePage = new GooglePage(page, 'google_stable', 'master22');
  // const results = new GoogleSearchResultsPage(page, 'master22');

  await googleSearchResultsPage.hoverOnFaviconTitle();

    // 2) перевірка підкреслення
    await googleSearchResultsPage.expectStyleableLinkUnderlined();
});

  // test('Hover on title', async () => {
  //   await googleSearchResultsPage.hoverAdsTitle();
  //   console.log('Hover on title');
  //   // await expect(googleSearchResultsPage.adsTitle).toHaveCSS('text-decoration', 'underline', { timeout: 5000 });
  //   await expect(googleSearchResultsPage.adsTitle).toHaveCSS('text-decoration', /underline/);
  //   console.log('The test of changing ad styles after hovering has passed!');
  // });

  // test('Hover on title', async () => {
  //   await googleSearchResultsPage.hoverAdsTitle();
  //   console.log('Hover on title');
  //   await expect(this.adsTitleLocator).toHaveCSS('text-decoration-line', 'underline', { timeout: 5000 });
  //   console.log('The test of changing ad styles after hovering has passed!');
  // });
});