import { expect } from '@playwright/test'; 
import { waitAndClick } from '../utils/helpers';
export class SearchResultsPage {
  constructor(page) {
    this.page = page;
    this.iframe = page.locator("iframe#master22");
    // this.moreButton = page.getByRole("button", { name: "More" });
    // this.moreButton = page.locator('g-popup#ow13');
    this.moreButton = page.locator('g-popup:has-text("More")');
    // this.webButton = page.locator('g-popup:visible >> text=Web');
    this.webButton = page.getByRole("link", { name: "Web" }).first();
    this.shoppingButton = page.getByRole("link", { name: "Shopping" });
    this.imagesButton = page.getByRole("link", { name: "Images" });
    this.newsButton = page.getByRole("link", { name: "News" });
    this.mapsButton = page.getByRole("link", { name: "Maps" });
    // this.navbar = page.locator('#hdtb-msb');
    // this.mapsButton = this.navbar.getByRole('link', { name: 'Maps', exact: true });
    this.shortVideosButton = page.getByRole("link", { name: "Short videos" });
    this.forumsButton = page.getByRole("link", { name: "Forums" });
    this.booksButton = page.getByRole("link", { name: "Books" });
    this.videosButton = page.getByRole("link", { name: "Videos" }).first();
    // const tabs = page.locator('#hdtb-msb');
    // this.videosButton = tabs.getByRole('link', { name: 'Videos', exact: true }).click();
  }

////////////////////////////////////////////////////

    async initAdsTitleLocator() {
      for (const frame of this.page.frames()) {
        const locator = frame.locator('.styleable-title.a');
        if (await locator.count() > 0) {
          this.adsTitleLocator = locator.first();
          return;
        }
      }
      throw new Error('Not found .styleable-title.a in any frame');
    }

    async initAdsFaviconLocator() {
      for (const frame of this.page.frames()) {
        const locator = frame.locator('div.favicon-background');
        if (await locator.count() > 0) {
          this.adsFaviconLocator = locator.first();
          return;
        }
      }
      throw new Error('Not found div.favicon-background in any frame');
    }

    async initAdsFaviconTitleLocator() {
      for (const frame of this.page.frames()) {
        const locator = frame.locator('p.favicon-title');
        if (await locator.count() > 0) {
          this.adsFaviconTitleLocator = locator.first();
          return;
        }
      }
      throw new Error('Not found p.favicon-title in any frame');
    }

    async initAdsFaviconDomainLocator() {
      for (const frame of this.page.frames()) {
        const locator = frame.locator('.favicon-domain');
        if (await locator.count() > 0) {
          this.adsFaviconDomainLocator = locator.first();
          return;
        }
      }
      throw new Error('Not found .favicon-domain in any frame');
    }

    async hoverAdsTitle() {
      if (!this.adsTitleLocator) {
        await this.initAdsTitleLocator();
      }
      await this.adsTitleLocator.waitFor({ state: 'visible', timeout: 20000 });
      await this.adsTitleLocator.hover();
      await expect(this.adsTitleLocator).toHaveCSS('text-decoration-line', 'underline', { timeout: 5000 });
    }

    async hoverAdsFavicon() {
      if (!this.adsFaviconLocator) {
        await this.initAdsFaviconLocator();
      }
      await this.adsFaviconLocator.waitFor({ state: 'visible', timeout: 20000 });
      await this.adsFaviconLocator.hover();
      await expect(this.adsTitleLocator).toHaveCSS('text-decoration-line', 'underline', { timeout: 5000 });
    }

    async hoverAdsFaviconTitle() {
      if (!this.adsFaviconTitleLocator) {
        await this.initAdsFaviconTitleLocator();
      }
      await this.adsFaviconTitleLocator.waitFor({ state: 'visible', timeout: 20000 });
      await this.adsFaviconTitleLocator.hover();
      await expect(this.adsTitleLocator).toHaveCSS('text-decoration-line', 'underline', { timeout: 5000 });
    }

    async hoverAdsFaviconDomain() {
      if (!this.adsFaviconDomainLocator) {
        await this.initAdsFaviconDomainLocator();
      }
      await this.adsFaviconDomainLocator.waitFor({ state: 'visible', timeout: 20000 });
      await this.adsFaviconDomainLocator.hover();
      await expect(this.adsTitleLocator).toHaveCSS('text-decoration-line', 'underline', { timeout: 5000 });
    }

  ////////////////////////////////////////////////////////////  
  
  async clickMoreButton() {
      try {
        await waitAndClick(this.moreButton, 10000);
      } catch (error) {
        console.log("Error clicking on the more button");
      }
    };

  async clickWebButton() {
    try {
      await waitAndClick(this.webButton, 10000);
    } catch (error) {
      console.log("Error clicking on the web button")
    }
  };

  ////////////////////////////////////////////////////////////

  async frameIsMissing() {
    try {
      await expect(this.page.locator('iframe#master22')).toHaveCount(0);
      console.log("iframe#master22 is not found in any other tabs");
      return true;
    } catch {
      console.error("iframe#master22 found");
      return false;
    }
  }

  async clickShoppingButton() {
    try {
      await waitAndClick(this.moreButton, 5000);
      await waitAndClick(this.shoppingButton, 5000);
    } catch (error) {
      console.log("Error clicking on the shopping button");
    }
  };

  async backToSearchResult() {
    await this.page.goBack();
  };

  async clickImagesButton() {
    try {
      await waitAndClick(this.moreButton, 5000);
      await waitAndClick(this.imagesButton, 5000);
    } catch (error) {
      console.log("Error clicking on the images button");
    }
  };

  async clickNewsButton() {
    try {
      await waitAndClick(this.moreButton, 5000);
      await waitAndClick(this.newsButton, 5000);
    } catch (error) {
      console.log("Error clicking on the news button");
    }
  };

  async clickMapsButton() {
    try {
      await waitAndClick(this.moreButton, 5000);
      await waitAndClick(this.mapsButton, 5000);
    } catch (error) {
      console.log("Error clicking on the maps button");
    }
  };

  async clickShortVideosButton() {
    try {
      await waitAndClick(this.moreButton, 5000);
      await waitAndClick(this.shortVideosButton, 5000);
    } catch (error) {
      console.log("Error clicking on the short videos button");
    }
  };

  async clickForumsButton() {
    try {
      await waitAndClick(this.moreButton, 5000);
      await waitAndClick(this.forumsButton, 5000);
    } catch (error) {
      console.log("Error clicking on the forums button");
    }
  };

  async clickBooksButton() {
    try {
      await waitAndClick(this.moreButton, 5000);
      await waitAndClick(this.booksButton, 5000);
    } catch (error) {
      console.log("Error clicking on the books button");
    }
  };

  async clickMapsInSameTab() {
    const nav = this.page.locator('#hdtb-msb'); 
    // обмежити пошук лише на тулбарі з табами
  
    // 1) Клік по кнопці Maps у тому самому контейнері
    await nav.getByRole('link', { name: 'Maps', exact: true }).click();
  
    // 2) Явно чекаємо, поки URL стане картовим
    await this.page.waitForURL(/tbm=map/, { timeout: 15000 });
  
    // — тепер ви на картинках —
  
    // 3) Повертаємось назад через URL
    await this.page.goBack();
  
    // 4) І чекаємо, що знову повернулися на пошук
    await this.page.waitForURL(/search\?/, { timeout: 15000 });
  }
  
  async clickVideosButton() {
    try {
      await waitAndClick(this.moreButton, 5000);
      await waitAndClick(this.videosButton, 5000);
    } catch (error) {
      console.log("Error clicking on the videos button");
    }
  };
  
  ////////////////////////////////////////////////////////////

  async validateIframe() {
    try {
      const iframeLocator = this.page.locator("iframe#master22");

      await iframeLocator.waitFor({ state: "attached" });
      await iframeLocator.waitFor({ state: "visible" });

      const firstIframe = this.page.locator("iframe").first();
      const firstIframeId = await firstIframe.getAttribute("id");

      if (firstIframeId !== "master22") {
        throw new Error("iframe#master22 is not the first iframe");
      }

      console.log("iframe#master22 is visible and is the first iframe");
      return true;
    } catch {
      console.error("iframe#master22 not found, not visible, or not first");
      return false;
    }
  }

  async logIframeMetrics() {
    const iframe = this.page.locator("iframe#master22");

    await iframe.waitFor({ state: "attached" });
    await iframe.waitFor({ state: "visible" });

    const box = await iframe.boundingBox();

    if (box) {
      console.log(` iframe#master22 metrics:`);
      console.log(`- Position: (x: ${box.x}, y: ${box.y})`);
      console.log(`- Size: width: ${box.width}px, height: ${box.height}px`);
    } else {
      console.warn("Unable to get bounding box for iframe#master22");
    }
  }
  async logIframeDetails() {
    const iframe = this.page.locator('iframe#master22');
  
    // Wait for iframe to be attached and visible
    await iframe.waitFor({ state: 'attached' });
    await iframe.waitFor({ state: 'visible' });
  
    const elementHandle = await iframe.elementHandle();
    const box = await iframe.boundingBox();
  
    // Basic attributes
    const src = await iframe.getAttribute('src');
    const sandbox = await iframe.getAttribute('sandbox');
    const referrerPolicy = await iframe.getAttribute('referrerpolicy');
    const allow = await iframe.getAttribute('allow');
    const className = await iframe.getAttribute('class');
    const title = await iframe.getAttribute('title');
  
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
    const isFirst = firstIframeId === 'master22';
  
    // Output all collected information
    console.log('iframe#master22 details:');
    console.log(`- src: ${src}`);
    console.log(`- sandbox: ${sandbox}`);
    console.log(`- referrerpolicy: ${referrerPolicy}`);
    console.log(`- allow: ${allow}`);
    console.log(`- class: ${className}`);
    console.log(`- title: ${title}`);
    if (box) {
      console.log(`- Position: (x: ${box.x}, y: ${box.y})`);
      console.log(`- Size: width: ${box.width}px, height: ${box.height}px`);
    } else {
      console.warn('- Unable to get bounding box');
    }
    console.log(`- Styles:`);
    console.log(`  - display: ${styles.display}`);
    console.log(`  - visibility: ${styles.visibility}`);
    console.log(`  - opacity: ${styles.opacity}`);
    console.log(`  - z-index: ${styles.zIndex}`);
    console.log(`  - position: ${styles.position}`);
    console.log(`  - pointer-events: ${styles.pointerEvents}`);
    console.log(`- Visible in viewport: ${intersectionRatio * 100}%`);
    console.log(`- First iframe ID on page: ${firstIframeId}`);
    console.log(`- Is first: ${isFirst}`);
  }
}
