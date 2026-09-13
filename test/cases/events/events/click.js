/** @import { Page } from '@playwright/test'; */
/** @import { click } from '../../../../src/events/events.js'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate((_) => {
        document.body.innerHTML =
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>';
    });
};

/**
 * Registers shared click behavior tests.
 * @param {() => typeof click} createClick Creates the browser-side method adapter.
 */
export function clickTests(createClick) {
    test('triggers a click event only on the first node', async ({ page }) => {
        const operation = await page.evaluateHandle(createClick);

        expect(await page.evaluate((operation) => {
            const targets = [];
            for (const element of document.querySelectorAll('a')) {
                element.addEventListener('click', (event) => {
                    targets.push(event.target.id);
                });
            }

            operation('a');
            return targets;
        }, operation)).toEqual(['test1']);
    });
}
