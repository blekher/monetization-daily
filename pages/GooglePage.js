export class GooglePage {
    constructor(page) {
        this.page = page;
        this.searchBox = page.getByRole('combobox', { name: 'Search' });
        this.searchButton = page.getByRole('button', { name: 'Google Search' }).first();
        this.notNowButton = page.getByRole('button', { name: 'Not now' });
        this.selectField = page.locator('#select-field');
    }

    async navigate() {
        await this.page.goto('https://www.google.com/');
    }

    async selectModule() {
        await this.selectField.selectOption('google_stable');
    }

    async search(query) {
        await this.searchBox.fill(query);
        await this.searchButton.click();
        await this.page.waitForTimeout(3000);
    }

    async closeLocationPopup() {
        if (await this.notNowButton.isVisible()) {
            await this.notNowButton.click();
        }
        await this.page.waitForTimeout(10000);
    }
}