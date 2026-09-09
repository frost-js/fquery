/** @import { Page } from '@playwright/test'; */

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
            '<div id="parent1">' +
            '<span data-id="span1"></span>' +
            '<span data-id="span2"></span>' +
            '<span data-id="span3"></span>' +
            '</div>' +
            '<div id="parent2">' +
            '<span data-id="span2"></span>' +
            '<span data-id="span3"></span>' +
            '<span data-id="span4"></span>' +
            '</div>' +
            '<div id="parent3">' +
            '<a data-id="a1"></a>' +
            '<a data-id="a2"></a>' +
            '<a data-id="a3"></a>' +
            '</div>';
    });
};

/**
 * Registers shared isEqual behavior tests.
 * @param {((args: [string, string, { shallow: boolean }?]) => boolean)} isEqual The browser callback for isEqual.
 */
export function isEqualTests(isEqual) {
    test('returns true if any node is equal to any other node', async ({ page }) => {
        expect(await page.evaluate(isEqual, ['#parent1 span', '#parent2 span'])).toBe(true);
    });

    test('returns false if no nodes are equal to any other node', async ({ page }) => {
        expect(await page.evaluate(isEqual, ['#parent1 span', '#parent3 a'])).toBe(false);
    });

    test('works with shallow option', async ({ page }) => {
        expect(await page.evaluate(isEqual, ['#parent1 span', '#parent2 span', { shallow: true }])).toBe(true);
    });
}
