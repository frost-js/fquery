/** @import { Page } from '@playwright/test'; */
/** @import { focus } from '../../../../src/events/events.js'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML =
            '<input type="text" id="test1">' +
            '<input type="text" id="test2">';
    });
};

/**
 * Registers shared focus behavior tests.
 * @param {() => typeof focus} createFocus Creates the browser-side method adapter.
 */
export function focusTests(createFocus) {
    test('triggers a focus event only on the first node', async ({ page }) => {
        const operation = await page.evaluateHandle(createFocus);

        expect(await page.evaluate((operation) => {
            const targets = [];
            for (const element of document.querySelectorAll('input')) {
                element.addEventListener('focus', (event) => {
                    targets.push(event.target.id);
                });
            }

            operation('input');
            return {
                targets,
                activeElement: document.activeElement.id,
            };
        }, operation)).toEqual({
            targets: ['test1'],
            activeElement: 'test1',
        });
    });
}
