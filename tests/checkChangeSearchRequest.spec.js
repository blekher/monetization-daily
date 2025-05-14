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

test('Checking iframe URL changes after search query changes', { timeout: 120000 }, async ({ page }, testInfo) => {
  console.log('⏱ Test started...');
  const startTime = Date.now();

  const googlePage = new GooglePage(page);
  const searchResultsPage = new SearchResultsPage(page);


  try {
    await test.step('Navigate to Google and simulate user behavior', async () => {
      console.log('🌐 Navigating to Google...');
      await googlePage.navigate();
      console.log('🤖 Simulating human behavior...');
      await simulateHumanBehavior(page);
    });

    await test.step('Perform Google search', async () => {
      console.log('🔍 Performing search...');
      await googlePage.selectModule();
      await googlePage.search(testData.searchQuery);
      await googlePage.waitForSearchResults();
      await googlePage.closeLocationPopup();
      console.log('✅ Search completed');
    });

    await test.step('Check iframe URL', async () => {
      const raw = await searchResultsPage.getSearchParamsInUrl();
      const decoded = decodeURIComponent(raw);
      expect(decoded).toBe(testData.searchQuery);
    });

    // await test.step('Check change search request', async () => {
    //   await googlePage.search(testData.searchQueryCar);
    //   await googlePage.waitForSearchResults();
    //   const raw = await searchResultsPage.getSearchParamsInUrl();
    //   const decoded = decodeURIComponent(raw);
    //   expect(decoded).toBe(testData.searchQueryCar);
    //   await expect(googlePage.searchBox).toHaveValue(testData.searchQueryCar);
    // });

    await test.step('Check change search request', async () => {
      await googlePage.search(testData.searchQueryCar);
      const raw = await searchResultsPage.getSearchParamsInUrl();
      const decoded = decodeURIComponent(raw);
      expect(decoded).toBe(testData.searchQueryCar);
      await expect(googlePage.searchBox).toHaveValue(testData.searchQueryCar);
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