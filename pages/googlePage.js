import { expect } from "@playwright/test";
import { waitAndClick } from "../utils/helpers.js";

export class GooglePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {string} moduleName — наприклад "yahoo_stable"
   * @param {string} iframeId — наприклад "privatelayer"
   */
  constructor(page, moduleName, iframeId) {
    this.page = page;
    this.moduleName = moduleName;
    this.iframeId = iframeId;
    this.searchBox = page.getByRole("combobox", { name: "Search" });
    this.searchButton = page
      .getByRole("button", { name: "Google Search" })
      .first();
    this.notNowButton = page.getByRole("button", { name: "Not now" });
    // this.noThanksButton = page.getByRole("button", { name: "No, thanks" });
    this.selectField = page.locator("#select-field");
    this.paginationLink = page.locator('a[aria-label="Page 2"]');
  }


  async navigate() {
    await this.page.goto("https://www.google.com/", {
      waitUntil: "load"
    });
    await this.page.waitForLoadState("domcontentloaded");
  }

  // async closeGeminiPopup() {
  //   try {
  //     await waitAndClick(this.noThanksButton, 10000);
  //   } catch (error) {
  //     console.log("Location popup not found or already closed");
  //   }
  // }

  async selectModule() {
    await this.selectField.waitFor({ state: "visible", timeout: 10000 });
    await this.selectField.selectOption(this.moduleName);
    await this.page.waitForTimeout(1000);
  }

  async search(query) {
    try {
      // Wait for search box to be visible and ready
      // await this.searchBox.waitFor({ state: "visible", timeout: 10000 });
      // await this.page.waitForTimeout(1000);

      // // Clear any existing text
      // await this.searchBox.click();
      // await this.searchBox.fill("");
      // await this.page.waitForTimeout(500);

      // // Type the search query
      // await this.searchBox.fill(query);
      // await this.page.waitForTimeout(1000);

      // // Press Enter
      // await this.searchBox.press("Enter");
      // await this.page.waitForTimeout(1000);

      await this.searchBox.waitFor({ state: 'visible', timeout: 10000 });

      await this.searchBox.fill(query);
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        this.searchBox.press('Enter'),
      ]);
    } catch (error) {
      console.error("Error during search:", error);
      throw error;
    }
  }

  async closeLocationPopup() {
    try {
      await waitAndClick(this.notNowButton, 10000);
    } catch (error) {
      console.log("Location popup not found or already closed");
    }
  }

  async waitForSearchResults() {
    try {
      // Чекаємо поки пошукове поле знову стане доступним
      await this.searchBox.waitFor({ state: 'visible', timeout: 10000 });
      // Додаткова перевірка, що сторінка відкрита
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.error("Error waiting for search results:", error);
      throw error;
    }
  }

  async goToSearchPage(n = 2) {
    const pageLink = this.page.locator(`a[aria-label="Page ${n}"]`);
    await expect(pageLink).toBeVisible({ timeout: 10000 });
    await pageLink.click();
    await this.page.waitForLoadState("load");
  }

  async editSearchQuery(newQuery) {
    try {
      // Очікуємо поки пошуковий рядок стане видимим
      await this.searchBox.waitFor({ state: 'visible', timeout: 10000 });
      
      // Очищаємо поточний запит
      await this.searchBox.click();
      await this.searchBox.fill("");
      await this.page.waitForTimeout(500);

      // Вводимо новий запит
      await this.searchBox.fill(newQuery);
      await this.page.waitForTimeout(500);

      // Натискаємо Enter і очікуємо навігації
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        this.searchBox.press('Enter'),
      ]);
    } catch (error) {
      console.error("Error during search query editing:", error);
      throw error;
    }
  }

  async appendToSearchQuery(suffix) {
    try {
      await this.searchBox.waitFor({ state: 'visible', timeout: 10000 });
      await this.searchBox.click();
      await this.searchBox.type(suffix);
      await this.page.waitForTimeout(500);
      await this.searchBox.press('Enter');
      await this.page.waitForLoadState('networkidle');
      await this.waitForSearchResults();
    } catch (error) {
      console.error("Error during appending to search query:", error);
      throw error;
    }
  }
}
