
export class SearchResultsPage {
    constructor(page) {
        this.page = page;
    }

    async checkForIframe() {
        try {
            const iframeLocator = this.page.locator('iframe#master22');

            await iframeLocator.waitFor({ state: 'attached' });

            await iframeLocator.waitFor({ state: 'visible' });

            console.log('iframe with id="master22" is visible and attached');
        } catch (error) {
            console.error('iframe with id="master22" did not appear in time');
            throw new Error('Iframe with id="master22" not found or not visible');
        }
    }
}