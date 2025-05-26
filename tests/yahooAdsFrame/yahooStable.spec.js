import { expect } from "@playwright/test";
import { test } from '../fixtures.js';

// import { GooglePage } from ".../pages/googlePage.js";
import { GooglePage } from "../../pages/googlePage.js";
import { ExtensionsPage } from "../../pages/extensionsPage.js";
import { YahooResultsPage } from "../../pages/yahooResultsPage.js";

import {
  takeFullPageScreenshot,
  saveNetworkLogs,
  saveIframeDetailsToFile,
} from "../../utils/helpers.js";

import { testData } from "../testData.js";

let googlePage, yahooResultsPage, extensionsPage, networkLogs;

test.describe("Testing Yahoo stable module", () => {
  test.beforeEach(async ({ page }) => {
    googlePage = new GooglePage(page, "yahoo_stable", "privatelayer");
    yahooResultsPage = new YahooResultsPage(page, "privatelayer", "yahoo_stable");
    extensionsPage = new ExtensionsPage(page);
    networkLogs = [];

    page.on("request", (request) => {
      networkLogs.push(`Request: ${request.method()} ${request.url()}`);
    });

    page.on("response", (response) => {
      networkLogs.push(`Response: ${response.status()} ${response.url()}`);
    });
  });

  test("Full test flow with Yahoo iframe validation", async ({ page }) => {
    await test.step("Verify extension is installed", async () => {
      await extensionsPage.navigate();
      await extensionsPage.verifyExtensionInstalled();
    });

    await test.step("Search on Google and validate iframe on page 1", async () => {
      console.log("==== PAGE 1 START ====");
      await googlePage.navigate();
      await googlePage.selectModule();
      await googlePage.search(testData.searchQuery);
      await googlePage.waitForSearchResults();
      await googlePage.closeLocationPopup();

      const isIframeValid = await yahooResultsPage.validateIframe();
      await yahooResultsPage.logIframeDetails();
      if (!isIframeValid) throw new Error("iframe#privatelayer failed validation on page 1");

      await saveIframeDetailsToFile(page, 'yahoo-iframe-page-1.json', 'privatelayer');
      await takeFullPageScreenshot(page, 'yahoo-' + testData.screenshots.page1);
    });

    await test.step("Go to page 2 and validate iframe", async () => {
      console.log("==== PAGE 2 START ====");
      await googlePage.goToSearchPage(2);
      await googlePage.waitForSearchResults();

      const isIframeValid2 = await yahooResultsPage.validateIframe();
      await yahooResultsPage.logIframeDetails();
      if (!isIframeValid2) throw new Error("iframe#privatelayer failed validation on page 2");

      await saveIframeDetailsToFile(page, 'yahoo-iframe-page-2.json', 'privatelayer');
      await takeFullPageScreenshot(page, 'yahoo-' + testData.screenshots.page2);
    });

    await test.step("Save network logs", async () => {
      saveNetworkLogs(networkLogs, "logs/yahoo-network_requests.log");
    });

    console.log("Browser closed");
  });
});