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

test('Checking the validity of a search query when navigating through history with arrows', { timeout: 120000 }, async ({ page }, testInfo) => {
    console.log('⏱ Test started...');
    const startTime = Date.now();

    const googlePage = new GooglePage(page);
    const searchResultsPage = new SearchResultsPage(page);


    try {
        await test.step('Navigate to Google and simulate user behavior', async () => {
            console.log('🌐 Navigating to Google...');
            await googlePage.navigate();
            console.log('🤖 Simulating human behavior...');
            //   await simulateHumanBehavior(page);
        });

        await test.step('Perform Google search', async () => {
            console.log('🔍 Performing search...');
            await googlePage.selectModule();
            await googlePage.search(testData.searchQueryCar);
            await googlePage.waitForSearchResults();
            // await googlePage.closeLocationPopup();
            console.log('✅ Search completed');
        });

        await test.step('Check iframe URL', async () => {
            const raw = await searchResultsPage.getSearchParamsInUrl();
            const decoded = decodeURIComponent(raw);
            expect(decoded).toBe(testData.searchQueryCar);
        });

        await test.step('Check change search request', async () => {
            const searchBoxValue = await searchResultsPage.searchBox.inputValue();
            console.log('Текст в полі пошуку:', searchBoxValue);
            const newSearchRequest = `${searchBoxValue}`;
            const raw = await searchResultsPage.getSearchParamsInUrl();
            const decoded = decodeURIComponent(raw);
            expect(decoded).toBe(newSearchRequest);
        });

        await test.step('Perform Google search', async () => {
            console.log('🔍 Performing search...');
            await googlePage.selectModule();
            await googlePage.search(testData.searchQueryCarFlorida);
            await googlePage.waitForSearchResults();
            // await googlePage.closeLocationPopup();
            console.log('✅ Search completed');
        });

        await test.step('Check iframe URL', async () => {
            const raw = await searchResultsPage.getSearchParamsInUrl();
            const decoded = decodeURIComponent(raw);
            expect(decoded).toBe(testData.searchQueryCarFlorida);
        });

        await test.step('Check change search request', async () => {
            const searchBoxValue = await searchResultsPage.searchBox.inputValue();
            console.log('Текст в полі пошуку:', searchBoxValue);
            const newSearchRequest = `${searchBoxValue}`;
            const raw = await searchResultsPage.getSearchParamsInUrl();
            const decoded = decodeURIComponent(raw);
            expect(decoded).toBe(newSearchRequest);
        });

        await test.step('Go back with the arrow', async () => {
            await searchResultsPage.backToSearchResult();
        });

        await test.step('Check iframe URL', async () => {
            const raw = await searchResultsPage.getSearchParamsInUrl();
            const decoded = decodeURIComponent(raw);
            expect(decoded).toBe(testData.searchQueryCar);
        });

        await test.step('Check change search request', async () => {
            const searchBoxValue = await searchResultsPage.searchBox.inputValue();
            console.log('Текст в полі пошуку:', searchBoxValue);
            const newSearchRequest = `${searchBoxValue}`;
            const raw = await searchResultsPage.getSearchParamsInUrl();
            const decoded = decodeURIComponent(raw);
            expect(decoded).toBe(newSearchRequest);
        });

        await test.step('Go forward with the arrow', async () => {
            await searchResultsPage.goForwardInHistory();
        });

        await test.step('Check iframe URL', async () => {
            const raw = await searchResultsPage.getSearchParamsInUrl();
            const decoded = decodeURIComponent(raw);
            expect(decoded).toBe(testData.searchQueryCarFlorida);
        });

        await test.step('Check change search request', async () => {
            const searchBoxValue = await searchResultsPage.searchBox.inputValue();
            console.log('Текст в полі пошуку:', searchBoxValue);
            const newSearchRequest = `${searchBoxValue}`;
            const raw = await searchResultsPage.getSearchParamsInUrl();
            const decoded = decodeURIComponent(raw);
            expect(decoded).toBe(newSearchRequest);
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