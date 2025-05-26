import { expect } from '@playwright/test';

export class YahooResultsPage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {string} moduleName — наприклад "yahoo_stable"
   * @param {string} iframeId — наприклад "privatelayer"
   */
  constructor(page, iframeId) {
    this.page = page;
    this.iframeId = iframeId;
    this.selectors = {
      mainBlock: "div#main",
      webBlock: "div#web",
      mainLinks: "xpath=(//*[@id='main']/div/ol[not(contains(@class, 'searchCenterFooter'))])[1]/li[not(contains(@style, 'display: none'))]",
      webLinks: "xpath=//*[@id='web']/ol/li[not(contains(@style, 'display: none')) and not(contains(@class, 'has-extra-content'))]",
    };
  }

  get iframe() {
    return this.page.locator(`iframe#${this.iframeId}`);
  }

  get blockSelectors() {
    return [this.selectors.mainBlock, this.selectors.webBlock];
  }

  async validateIframe() {
    try {
      await this.iframe.waitFor({ state: "attached" });
      await this.iframe.waitFor({ state: "visible" });

      const firstIframe = this.page.locator("iframe").first();
      const firstIframeId = await firstIframe.getAttribute("id");

      if (firstIframeId !== this.iframeId) {
        throw new Error(`iframe#${this.iframeId} is not the first frame`);
      }

      console.log(`iframe#${this.iframeId} is visible and is the first iframe`);
      return true;
    } catch {
      console.error(`iframe#${this.iframeId} not found, not visible, or not first`);
      return false;
    }
  }

  async countIframeBlocks(selectors = this.blockSelectors) {
    await this.iframe.waitFor({ state: "attached" });
    const iframe = this.page.frameLocator(`#${this.iframeId}`);
    const results = {};

    for (const selector of selectors) {
      const elementCount = await iframe.locator(selector).count();
      results[selector] = elementCount;
    }

    return results;
  }

  async countLinksInBlock(linkSelector) {
    const frame = this.page.frameLocator(`#${this.iframeId}`);
    await this.iframe.waitFor({ state: "attached" });
    await this.iframe.waitFor({ state: "visible" });
  
    const linkCount = await frame.locator(linkSelector).count();
    return linkCount;
  }

  async logIframeMetrics() {
    await this.iframe.waitFor({ state: "attached" });
    await this.iframe.waitFor({ state: "visible" });

    const box = await this.iframe.boundingBox();

    if (box) {
      console.log(`iframe${this.iframeId} metrics:`);
      console.log(`- Position: (x: ${box.x}, y: ${box.y})`);
      console.log(`- Size: width: ${box.width}px, height: ${box.height}px`);
    } else {
      console.warn(`Unable to get bounding box for iframe#${this.iframeId}`);
    }
  }
  
  async logIframeDetails() {
    // Wait for iframe to be attached and visible
    await this.iframe.waitFor({ state: 'attached' });
    await this.iframe.waitFor({ state: 'visible' });
  
    const elementHandle = await this.iframe.elementHandle();
    const box = await this.iframe.boundingBox();
  
    // Basic attributes
    const attributes = {
      src: await this.iframe.getAttribute('src'),
      sandbox: await this.iframe.getAttribute('sandbox'),
      referrerPolicy: await this.iframe.getAttribute('referrerpolicy'),
      allow: await this.iframe.getAttribute('allow'),
      className: await this.iframe.getAttribute('class'),
      title: await this.iframe.getAttribute('title'),
    };

  
    // Computed CSS styles
    const styles = await this.page.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        zIndex: style.zIndex,
        position: style.position,
        pointerEvents: style.pointerEvents
      };
    }, elementHandle);
  
    // Intersection ratio: visible part of iframe
    const intersectionRatio = await this.page.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const vpWidth = window.innerWidth;
      const vpHeight = window.innerHeight;
      const visibleX = Math.max(0, Math.min(rect.right, vpWidth) - Math.max(rect.left, 0));
      const visibleY = Math.max(0, Math.min(rect.bottom, vpHeight) - Math.max(rect.top, 0));
      const visibleArea = visibleX * visibleY;
      const totalArea = rect.width * rect.height;
      return totalArea > 0 ? (visibleArea / totalArea).toFixed(2) : '0';
    }, elementHandle);
  
    // Check if iframe is first on the page
    const firstIframeId = await this.page.locator('iframe').first().getAttribute('id');
    const isFirst = firstIframeId === this.iframeId;
  
    // Output all collected information
    console.log(`Details for iframe#${this.iframeId}: `);
    for (const [key, value] of Object.entries(attributes)) {
      console.log(` - ${key}: ${value}`);
    }

    if (box) {
      console.log(`- Position: (x: ${box.x}, y: ${box.y})`);
      console.log(`- Size: width: ${box.width}px, height: ${box.height}px`);
    } else {
      console.warn('- Unable to get bounding box');
    }

    console.log(`- Styles:`);
    for (const [key, value] of Object.entries(styles)) {
      console.log(` - ${key}: ${value}`);
    }

    console.log(`- Visible in viewport: ${intersectionRatio * 100}%`);
    console.log(`- First iframe ID on page: ${firstIframeId}`);
    console.log(`- Is first: ${isFirst}`);
  }
}
