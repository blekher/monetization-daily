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

test('Check for the absence of iframe monetization on the "Images", "Maps", "Short videos", "Videos", "News", "Shopping", "Forums", "Books" tabs.', 
  { timeout: 120000 }, async ({ page }, testInfo) => {
  console.log('⏱ Test started...');
  const startTime = Date.now();

  const googlePage = new GooglePage(page);
  const googleSearchResultsPage = new GoogleSearchResultsPage(page);


  try {
    await test.step('Navigate to Google and simulate user behavior', async () => {
      console.log('🌐 Navigating to Google...');
      await googlePage.navigate();
      // console.log('🤖 Simulating human behavior...');
      // await simulateHumanBehavior(page);
    });
    
    await test.step('Perform Google search', async () => {
      console.log('🔍 Performing search...');
      await googlePage.selectModule();
      await googlePage.search(testData.searchQuery);
      await googlePage.waitForSearchResults();
      // await googlePage.closeLocationPopup();
      console.log('✅ Search completed');
    });
    
    await test.step('Check iframe in Shopping tab', async () => {
      await googleSearchResultsPage.clickShoppingButton();
      console.log('Go to shopping tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in shopping tab');
      expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Shopping');
      console.log('This is shopping tab!')
      await googleSearchResultsPage.backToSearchResult();
      console.log('Back to Search Result page');
    });
    
    await test.step('Check iframe in Images tab', async () => {
      await googleSearchResultsPage.clickImagesButton();
      console.log('Go to images tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in images tab');
      expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Images');
      await googleSearchResultsPage.backToSearchResult();
      console.log('Back to Search Result page');
    });
     
    await test.step('Check iframe in News tab', async () => {
      await googleSearchResultsPage.clickNewsButton();
      console.log('Go to news tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in news tab');
      expect(await googleSearchResultsPage.getCurrentPageType()).toBe('News');
      await googleSearchResultsPage.backToSearchResult();
      console.log('Back to Search Result page');
    });
     
    await test.step('Check iframe in ShortVideos tab', async () => {
      await googleSearchResultsPage.clickShortVideosButton();
      console.log('Go to short videos tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in short videos tab');
      // expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Shopping');
      await googleSearchResultsPage.backToSearchResult();
      console.log('Back to Search Result page');
    });
     
    await test.step('Check iframe in Forums tab', async () => {
      await googleSearchResultsPage.clickForumsButton();
      console.log('Go to forums tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in forums tab');
      expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Forums');
      await googleSearchResultsPage.backToSearchResult();
      console.log('Back to Search Result page');
    });
     
    await test.step('Check iframe in Books tab', async () => {
      await googleSearchResultsPage.clickBooksButton();
      console.log('Go to books tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in books tab');
      expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Books');
      await googleSearchResultsPage.backToSearchResult();
      console.log('Back to Search Result page');
    });
     
    await test.step('Check iframe in Videos tab', async () => {
      await googleSearchResultsPage.clickVideosButton();
      console.log('Go to videos tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in videos tab');
      // expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Videos');
      await googleSearchResultsPage.backToSearchResult();
      console.log('Back to Search Result page');
    });
     
    await test.step('Check iframe in Maps tab', async () => {
      await googleSearchResultsPage.clickMapsButton();
      console.log('Go to maps tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in maps tab');
      // expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Locations');
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    const duration = Date.now() - startTime;
    console.log('⏱ Test duration (ms):', duration);
    console.log('✅ Test finished');
  }
});


///////////////////////////////////////////////////////////////////////////////


// import { test, expect } from '@playwright/test';
// import { GooglePage } from '../../pages/googlePage.js';
// import { GoogleSearchResultsPage } from '../../pages/googleSearchResultsPage.js';
// import { testData } from '../testData.js';
// import { simulateHumanBehavior } from '../../utils/helpers.js';

//   let startTime;
//   let googlePage;
//   let googleSearchResultsPage;

// test.describe('Відсутність монетизаційного iframe у неперших табах', () => {
  

//   test.beforeEach(async ({ page }) => {
//     startTime = Date.now();
//     googlePage = new GooglePage(page, 'google_stable', 'master22');
//     googleSearchResultsPage = new GoogleSearchResultsPage(page); 
//     console.log('🌐 Navigating to Google...');
//     await googlePage.navigate();
//     await googlePage.selectModule();
//     await googlePage.search(testData.searchQuery);
//     await googlePage.waitForSearchResults();
//     console.log('🔍 Performing search...');
//       await googlePage.selectModule();
//       await googlePage.search(testData.searchQuery);
//       await googlePage.waitForSearchResults();
//       // await googlePage.closeLocationPopup();
//       console.log('✅ Search completed');
//   });

//   test.afterEach(() => {
//     const duration = Date.now() - startTime;
//     console.log('⏱ Test duration (ms):', duration);
//   });


//  test('Perform Google search', async () => {
//       console.log('🔍 Performing search...');
//       await googlePage.selectModule();
//       await googlePage.search(testData.searchQuery);
//       await googlePage.waitForSearchResults();
//       // await googlePage.closeLocationPopup();
//       console.log('✅ Search completed');
//     });

//     test('Check iframe in Shopping tab', async () => {
//       await googleSearchResultsPage.clickShoppingButton();
//       console.log('Go to shopping tab');
//       await googleSearchResultsPage.frameIsMissing();
//       console.log('frame is not found in shopping tab');
//       expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Shopping');
//       console.log('This is shopping tab!')
//       await googleSearchResultsPage.backToSearchResult();
//       console.log('Back to Search Result page');
//     });

// test('Check iframe in Images tab', async () => {
//       await googleSearchResultsPage.clickImagesButton();
//       console.log('Go to images tab');
//       await googleSearchResultsPage.frameIsMissing();
//       console.log('frame is not found in images tab');
//       expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Images');
//       await googleSearchResultsPage.backToSearchResult();
//       console.log('Back to Search Result page');
//     });

// test('Check iframe in News tab', async () => {
//       await googleSearchResultsPage.clickNewsButton();
//       console.log('Go to news tab');
//       await googleSearchResultsPage.frameIsMissing();
//       console.log('frame is not found in news tab');
//       expect(await googleSearchResultsPage.getCurrentPageType()).toBe('News');
//       await googleSearchResultsPage.backToSearchResult();
//       console.log('Back to Search Result page');
//     });

// test('Check iframe in ShortVideos tab', async () => {
//       await googleSearchResultsPage.clickShortVideosButton();
//       console.log('Go to short videos tab');
//       await googleSearchResultsPage.frameIsMissing();
//       console.log('frame is not found in short videos tab');
//       // expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Shopping');
//       await googleSearchResultsPage.backToSearchResult();
//       console.log('Back to Search Result page');
//     });

// test('Check iframe in Forums tab', async () => {
//       await googleSearchResultsPage.clickForumsButton();
//       console.log('Go to forums tab');
//       await googleSearchResultsPage.frameIsMissing();
//       console.log('frame is not found in forums tab');
//       expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Forums');
//       await googleSearchResultsPage.backToSearchResult();
//       console.log('Back to Search Result page');
//     });

// test('Check iframe in Books tab', async () => {
//       await googleSearchResultsPage.clickBooksButton();
//       console.log('Go to books tab');
//       await googleSearchResultsPage.frameIsMissing();
//       console.log('frame is not found in books tab');
//       expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Books');
//       await googleSearchResultsPage.backToSearchResult();
//       console.log('Back to Search Result page');
//     });

// test('Check iframe in Videos tab', async () => {
//       await googleSearchResultsPage.clickVideosButton();
//       console.log('Go to videos tab');
//       await googleSearchResultsPage.frameIsMissing();
//       console.log('frame is not found in videos tab');
//       // expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Videos');
//       await googleSearchResultsPage.backToSearchResult();
//       console.log('Back to Search Result page');
//     });

// test('Check iframe in Maps tab', async () => {
//       await googleSearchResultsPage.clickMapsButton();
//       console.log('Go to maps tab');
//       await googleSearchResultsPage.frameIsMissing();
//       console.log('frame is not found in maps tab');
//       // expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Locations');
//     });
//   });