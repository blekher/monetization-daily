import { expect } from "@playwright/test";
import { saveNetworkLogs } from "./helpers.js"; // or correct relative path

/**
 * Attach request and response listeners for Yahoo requests.
 * Logs will be pushed into the provided logsArray.
 */
export function attachYahooLogListeners(page, logsArray) {
  page.removeAllListeners("request");
  page.removeAllListeners("response");

  page.on("request", async (request) => {
    try {
      const url = request.url();
      const hostname = new URL(url).hostname;
      if (hostname.includes("search.yahoo.com")) {
        const method = request.method();
        const headers = await request.allHeaders();
        const postData = request.postData();
        logsArray.push({
          type: "request",
          method,
          url,
          headers,
          postData: postData ? (() => {
            try {
              return JSON.parse(postData);
            } catch {
              return postData;
            }
          })() : null,
          timestamp: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn("⚠️ Request listener error:", e.message);
    }
  });

  page.on("response", async (response) => {
    try {
      const url = response.url();
      const hostname = new URL(url).hostname;
      if (hostname.includes("search.yahoo.com")) {
        const status = response.status();
        const headers = await response.allHeaders();
        let body = null;
        try {
          body = await response.json();
        } catch {}
        logsArray.push({
          type: "response",
          status,
          url,
          headers,
          body,
          timestamp: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn("⚠️ Response listener error:", e.message);
    }
  });
}

/**
 * Assert that Yahoo logs contain expected search query.
 * Throws test failure if query is not found.
 */
export function assertQueryInYahooLogs(logsArray, fullQuery) {
  const queryParam = fullQuery.toLowerCase().replace(/ /g, "+");

  const found = logsArray.some(log =>
    log.type === "request" &&
    (log.url.toLowerCase().includes(`p=${queryParam}`) ||
     log.url.toLowerCase().includes(`command=${encodeURIComponent(fullQuery)}`))
  );

  if (!found) {
    console.warn(`❌ Query "${fullQuery}" NOT found in any Yahoo request`);
    saveNetworkLogs(
      logsArray,
      `logs/yahoo-events-FAIL-${fullQuery.replace(/\s/g, "_")}.log`
    );
  } else {
    console.log(`✅ Query "${fullQuery}" found in Yahoo request`);
  }

  expect(found, `Expected query "${fullQuery}" to appear in Yahoo request`).toBeTruthy();
}

export function isQueryInYahooUrl(url, query) {
    const q = query.toLowerCase().replace(/ /g, "+");
    return url.toLowerCase().includes(`p=${q}`) || url.toLowerCase().includes(`command=${encodeURIComponent(query)}`);
  }