import { expect } from '@playwright/test';
import { test } from '../fixtures.js';
import { GooglePage } from '../../pages/googlePage.js';
import { GoogleSearchResultsPage } from '../../pages/googleSearchResultsPage.js';
import { testData } from '../testData.js';
import { simulateHumanBehavior } from '../../utils/helpers.js';

  let startTime;
  let googlePage;
  let googleSearchResultsPage;

test.describe.serial('Check for the absence of iframe monetization on the "Images", "Maps", "Short videos", "Videos", "News", "Shopping", "Forums", "Books" tabs.', () => {
  

  test.beforeEach(async ({ page }) => {
    startTime = Date.now();
    googlePage = new GooglePage(page, 'google_stable', 'master22');
    googleSearchResultsPage = new GoogleSearchResultsPage(page); 
    console.log('🌐 Navigating to Google...');
    await googlePage.navigate();
    await googlePage.selectModule();
    await googlePage.search(testData.searchQuery);
    await googlePage.waitForSearchResults();
    console.log('🔍 Performing search...');
      await googlePage.selectModule();
      await googlePage.search(testData.searchQuery);
      await googlePage.waitForSearchResults();
      await googlePage.closeLocationPopup();
      console.log('✅ Search completed');
  });

  test.afterEach(() => {
    const duration = Date.now() - startTime;
    console.log('⏱ Test duration (ms):', duration);
  });

    test('Check iframe in Shopping tab', async () => {
      await googleSearchResultsPage.clickShoppingButton();
      console.log('Go to shopping tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in shopping tab');
      expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Shopping');
      console.log('This is shopping tab!')
    });

test('Check iframe in Images tab', async () => {
      await googleSearchResultsPage.clickImagesButton();
      console.log('Go to images tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in images tab');
      expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Images');
    });

test('Check iframe in News tab', async () => {
      await googleSearchResultsPage.clickNewsButton();
      console.log('Go to news tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in news tab');
      expect(await googleSearchResultsPage.getCurrentPageType()).toBe('News');
    });

test('Check iframe in ShortVideos tab', async () => {
      await googleSearchResultsPage.clickShortVideosButton();
      console.log('Go to short videos tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in short videos tab');
      // expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Shopping');
    });

test('Check iframe in Forums tab', async () => {
      await googleSearchResultsPage.clickForumsButton();
      console.log('Go to forums tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in forums tab');
      expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Forums');
    });

test('Check iframe in Books tab', async () => {
      await googleSearchResultsPage.clickBooksButton();
      console.log('Go to books tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in books tab');
      expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Books');
    });

test('Check iframe in Videos tab', async () => {
      await googleSearchResultsPage.clickVideosButton();
      console.log('Go to videos tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in videos tab');
      // expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Videos');
    });

test('Check iframe in Maps tab', async () => {
      await googleSearchResultsPage.clickMapsButton();
      console.log('Go to maps tab');
      await googleSearchResultsPage.frameIsMissing();
      console.log('frame is not found in maps tab');
      // expect(await googleSearchResultsPage.getCurrentPageType()).toBe('Locations');
    });
  });