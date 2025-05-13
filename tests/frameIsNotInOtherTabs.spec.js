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

test('CheckHoverOnAds', { timeout: 120000 }, async ({ page }, testInfo) => {
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
    await test.step('Check iframe in shopping tab', async () => {
      await searchResultsPage.clickShoppingButton();
      console.log('Go to shopping tab');
      await searchResultsPage.frameIsMissing();
      console.log('frame is not found in shopping tab');
      await searchResultsPage.backToSearchResult();
      console.log('Back to Search Result page');
    });

    await test.step('Check iframe in Images tab', async () => {
      await searchResultsPage.clickImagesButton();
      console.log('Go to images tab');
      await searchResultsPage.frameIsMissing();
      console.log('frame is not found in images tab');
      await searchResultsPage.backToSearchResult();
      console.log('Back to Search Result page');
    });

    await test.step('Check iframe in News tab', async () => {
      await searchResultsPage.clickNewsButton();
      console.log('Go to news tab');
      await searchResultsPage.frameIsMissing();
      console.log('frame is not found in news tab');
      await searchResultsPage.backToSearchResult();
      console.log('Back to Search Result page');
    });

    // await searchResultsPage.clickMapsButton();
    // console.log('Go to maps tab');
    // await searchResultsPage.frameIsMissing();
    // console.log('frame is not found in maps tab');
    // // await searchResultsPage.backToSearchResult();
    // //////////////////////////////////////////////
    // await searchResultsPage.clickMapsInSameTab();
    // console.log('Back to Search Result page');

    await test.step('Check iframe in ShortVideos tab', async () => {
      await searchResultsPage.clickShortVideosButton();
      console.log('Go to short videos tab');
      await searchResultsPage.frameIsMissing();
      console.log('frame is not found in short videos tab');
      await searchResultsPage.backToSearchResult();
      console.log('Back to Search Result page');
    });

    await test.step('Check iframe in Forums tab', async () => {
      await searchResultsPage.clickForumsButton();
      console.log('Go to forums tab');
      await searchResultsPage.frameIsMissing();
      console.log('frame is not found in forums tab');
      await searchResultsPage.backToSearchResult();
      console.log('Back to Search Result page');
    });

    await test.step('Check iframe in Forums tab', async () => {
      await searchResultsPage.clickBooksButton();
      console.log('Go to books tab');
      await searchResultsPage.frameIsMissing();
      console.log('frame is not found in books tab');
      await searchResultsPage.backToSearchResult();
      console.log('Back to Search Result page');
    });

    await test.step('Check iframe in Forums tab', async () => {
      await searchResultsPage.clickVideosButton();
      console.log('Go to videos tab');
      await searchResultsPage.frameIsMissing();
      console.log('frame is not found in videos tab');
      await searchResultsPage.backToSearchResult();
      console.log('Back to Search Result page');
    });

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