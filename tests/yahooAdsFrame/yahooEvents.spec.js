import { expect } from "@playwright/test";
import { test } from "../fixtures.js";
import { GooglePage } from "../../pages/googlePage.js";
import { ExtensionsPage } from "../../pages/extensionsPage.js";
import { YahooResultsPage } from "../../pages/yahooResultsPage.js";
import { saveNetworkLogs } from "../../utils/helpers.js";
import {
  attachYahooLogListeners,
  assertQueryInYahooLogs
} from "../../utils/yahooLogs.js";
 
let googlePage, yahooResultsPage, extensionsPage, networkLogs;
 
test.describe("Testing Yahoo system events with gradual query changes", () => {
  test.beforeEach(async ({ page }) => {
    googlePage = new GooglePage(page, "yahoo_stable", "privatelayer");
    yahooResultsPage = new YahooResultsPage(page, "privatelayer", "yahoo_stable");
    extensionsPage = new ExtensionsPage(page);
    networkLogs = [];
  });
 
  test.afterEach(async ({ page }, testInfo) => {
    // Save logs if test failed
    if (testInfo.status !== testInfo.expectedStatus && networkLogs.length > 0) {
      const fileName = `logs/yahoo-events-${testInfo.title.replace(/\s+/g, "_")}.log`;
      saveNetworkLogs(networkLogs, fileName);
      await page.screenshot({ path: fileName.replace('.log', '.png'), fullPage: true });
    }
  });
 
  test("C591 – Verification of sending Yahoo system events when editing the search query", async ({ page }) => {
    await test.step("Verify extension is installed", async () => {
      await extensionsPage.navigate();
      await extensionsPage.verifyExtensionInstalled();
    });
 
    await test.step("Initial search", async () => {
      await googlePage.navigate();
      await googlePage.selectModule();
      await googlePage.search("car");
      await googlePage.waitForSearchResults();
      await googlePage.closeLocationPopup();
    });
 
    await test.step("Gradually edit query and check Yahoo events", async () => {
      const actions = [
        { query: "rent bike", method: "search" },
        { query: "e", method: "type" },
        { query: "1", method: "type" },
        { query: "!", method: "type" }
      ];
 
      let fullQuery = "";
 
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        networkLogs = [];
 
        attachYahooLogListeners(page, networkLogs);
 
        fullQuery = await applyQueryStep(page, googlePage, fullQuery, action);
 
        await googlePage.waitForSearchResults();
 
        assertQueryInYahooLogs(networkLogs, fullQuery);
      }
    });
  });
});
 
/**
* Applies a single query step: search, type, or press.
* Updates and returns the full query string.
*/
async function applyQueryStep(page, googlePage, fullQuery, action) {
  const { query, method } = action;
 
  if (method === "search") {
    fullQuery = query;
    await googlePage.search(query);
    await page.waitForLoadState("networkidle");
  } else if (method === "type") {
    await googlePage.searchBox.focus();
    
    // Перевіряємо операційну систему
    const isMac = process.platform === "darwin";
    if (isMac) {
      await page.keyboard.down("Meta");
      await page.keyboard.press("ArrowRight");
      await page.keyboard.up("Meta");
    } else {
      // Для Windows використовуємо End
      await page.keyboard.press("End");
    }
    
    await page.keyboard.type(query);
    fullQuery += query;
    await page.waitForLoadState("networkidle");
  } else if (method === "press") {
    await googlePage.searchBox.focus();
    
    // Перевіряємо операційну систему
    const isMac = process.platform === "darwin";
    if (isMac) {
      await page.keyboard.down("Meta");
      await page.keyboard.press("ArrowRight");
      await page.keyboard.up("Meta");
    } else {
      // Для Windows використовуємо End
      await page.keyboard.press("End");
    }

    const keys = query.match(/\{[^}]+\}|[^\{\}]/g);
    for (const key of keys) {
      if (key.startsWith("{") && key.endsWith("}")) {
        await page.keyboard.press(key.slice(1, -1));
        fullQuery = fullQuery.slice(0, -1);
      } else {
        await page.keyboard.type(key);
        fullQuery += key;
      }
    }

    await page.waitForLoadState("networkidle");
  }
 
  return fullQuery;
}
 