export class SearchResultsPage {
    constructor(page) {
        this.page = page;
    }

    async validateIframe() {
        try {
            const iframeLocator = this.page.locator('iframe#master22');
    
            await iframeLocator.waitFor({ state: 'attached' });
            await iframeLocator.waitFor({ state: 'visible' });
    
            const firstIframe = this.page.locator('iframe').first();
            const firstIframeId = await firstIframe.getAttribute('id');
    
            if (firstIframeId !== 'master22') {
                throw new Error('iframe#master22 is not the first iframe');
            }
    
            console.log('iframe#master22 is visible and is the first iframe');
            return true;
        } catch {
            console.error('iframe#master22 not found, not visible, or not first');
            return false;
        }
    }
}