import { test as base } from '@playwright/test';
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const extensionPath = path.resolve(__dirname, './monetization_test');

// use this fixture in your tests
export const test = base.extend({
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext('./userData', {
      headless: false,
      args: [
        '--start-maximized',
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--disable-blink-features=AutomationControlled'
      ],
    });

    await use(context);
    await context.close(); // close the context after the test
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close(); // close the page after the test
  }
});