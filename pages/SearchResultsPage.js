export class SearchResultsPage {
    constructor(page) {
        this.page = page;
        this.targetIframe = page.frameLocator('#master22'); 
    }

    async checkForIframe() {
        // Check iframe id="master22"
        const iframeLocator = this.page.locator('iframe#master22');
        const isVisible = await iframeLocator.isVisible({ timeout: 6000 });

        if (isVisible) {
            console.log('Found iframe with id="master22"');
            return true;
        } else {
            console.error('iframe with id="master22" not found or not visible - TEST FAILED');
            throw new Error('Iframe with id="master22" not found');
        }
    }
}