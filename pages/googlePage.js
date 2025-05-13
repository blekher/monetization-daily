import { expect } from "@playwright/test";
import { waitAndClick } from "../utils/helpers.js";

export class GooglePage {
  constructor(page) {
    this.page = page;
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
    await this.selectField.selectOption("google_stable");
    await this.page.waitForTimeout(1000);
  }

  async search(query) {
    try {
      // Wait for search box to be visible and ready
      await this.searchBox.waitFor({ state: "visible", timeout: 10000 });
      await this.page.waitForTimeout(1000);

      // Clear any existing text
      await this.searchBox.click();
      await this.searchBox.fill("");
      await this.page.waitForTimeout(500);

      // Type the search query
      await this.searchBox.fill(query);
      await this.page.waitForTimeout(1000);

      // Press Enter
      await this.searchBox.press("Enter");
      await this.page.waitForTimeout(1000);
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
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(2000);
  }

  async goToSearchPage(n = 2) {
    const pageLink = this.page.locator(`a[aria-label="Page ${n}"]`);
    await expect(pageLink).toBeVisible({ timeout: 10000 });
    await pageLink.click();
    await this.page.waitForLoadState("load");
  }
}
