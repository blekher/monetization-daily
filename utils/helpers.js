/**
 * Waits for a locator to be visible and clicks it.
 * @param {Locator} locator - Playwright locator object
 * @param {number} timeout - Time to wait for the element (ms). Default: 10 sec.
 */
export async function waitAndClick(locator, timeout = 1000) {
    try {
        await locator.waitFor({ state: 'visible', timeout });
        await locator.click();
    } catch (error) {
        console.log(`Element not visible within ${timeout}ms, skipping click.`);
    }
}