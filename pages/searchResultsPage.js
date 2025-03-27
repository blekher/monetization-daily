export class SearchResultsPage {
  constructor(page) {
    this.page = page;
  }

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
