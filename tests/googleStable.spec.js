import { expect } from "@playwright/test";
import { test} from './fixtures.js';
import { GooglePage } from "../pages/googlePage.js";
import { ExtensionsPage } from "../pages/extensionsPage.js";
import { SearchResultsPage } from "../pages/searchResultsPage.js";
import { takeFullPageScreenshot, saveNetworkLogs, saveIframeDetailsToFile } from "../utils/helpers.js";
import { testData } from "./testData.js";

let googlePage, searchResultsPage, extensionsPage, networkLogs;

test.describe("Testing Google stable module", () => {
  test.beforeEach(async ({ page }) => {
    googlePage = new GooglePage(page);
    searchResultsPage = new SearchResultsPage(page);
    extensionsPage = new ExtensionsPage(page);
    networkLogs = [];

    page.on("request", (request) => {
      networkLogs.push(`Request: ${request.method()} ${request.url()}`);
    });

    page.on("response", (response) => {
      networkLogs.push(`Response: ${response.status()} ${response.url()}`);
    });
  });

  test("Full test flow with iframe validation", async ({ page }) => {
    await test.step("Verify extension is installed", async () => {
      await extensionsPage.navigate();
      await extensionsPage.verifyExtensionInstalled();
    });

    await test.step("Search on Google and validate iframe on page 1", async () => {
      await googlePage.navigate();
      await googlePage.selectModule();
      await googlePage.search(testData.searchQuery);
      await googlePage.waitForSearchResults();
      await googlePage.closeLocationPopup();

      const isIframeValid = await searchResultsPage.validateIframe();
      if (!isIframeValid) throw new Error("iframe#master22 failed validation on page 1");

      await searchResultsPage.logIframeDetails();
      await saveIframeDetailsToFile(page, 'iframe-page-1.json');
      await takeFullPageScreenshot(page, testData.screenshots.page1);
    });

    await test.step("Go to page 2 and validate iframe", async () => {
      await googlePage.goToSearchPage(2);

      const isIframeValid2 = await searchResultsPage.validateIframe();
      if (!isIframeValid2) throw new Error("iframe#master22 failed validation on page 2");

      await searchResultsPage.logIframeDetails();
      await saveIframeDetailsToFile(page, 'iframe-page-2.json');
      await takeFullPageScreenshot(page, testData.screenshots.page2);
    });

    await test.step("Save network logs", async () => {
      saveNetworkLogs(networkLogs, testData.logFilePath);
    });

    console.log("Browser closed");
  });
});