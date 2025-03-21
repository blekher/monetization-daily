import { expect } from '@playwright/test';

export class ExtensionsPage {
    constructor(page) {
        this.page = page;
        this.extensionTitle = page.getByRole('heading', { name: 'Prod check monetization' });
    }

    async navigate() {
        await this.page.goto('chrome://extensions/', { waitUntil: 'domcontentloaded' });
    }

    async verifyExtensionInstalled() {
        await expect(this.extensionTitle).toBeVisible(); // ✅ `expect` is now defined
    }
}