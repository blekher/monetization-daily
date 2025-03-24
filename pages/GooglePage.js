import { expect } from '@playwright/test';
import { waitAndClick } from '../utils/helpers.js';

export class GooglePage {
    constructor(page) {
        this.page = page;
        this.searchBox = page.getByRole('combobox', { name: 'Search' });
        this.searchButton = page.getByRole('button', { name: 'Google Search' }).first();
        this.notNowButton = page.getByRole('button', { name: 'Not now' });
        this.selectField = page.locator('#select-field');
        this.paginationLink = page.locator('a[aria-label="Page 2"]');
    }

    async navigate() {
        await this.page.goto('https://www.google.com/');
    }

    async selectModule() {
        await this.selectField.selectOption('google_stable');
    }

    async search(query) {
        await this.searchBox.fill(query);
        await this.page.waitForTimeout(1000);
        await this.searchBox.press('Enter');
    }

    async closeLocationPopup() {
        await waitAndClick(this.notNowButton, 1000);
    }
    async waitForSearchResults() {
        await this.page.waitForLoadState('networkidle'); 
    }

    async goToSearchPage(n = 2) {
        const pageLink = this.page.locator(`a[aria-label="Page ${n}"]`);
    
        await expect(pageLink).toBeVisible();
    
        await pageLink.click();
    
        //await this.page.waitForLoadState('networkidle');
        //await this.page.waitForTimeout(3000);
    }
}