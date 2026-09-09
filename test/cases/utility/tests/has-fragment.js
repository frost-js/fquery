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
            '<template id="template1">' +
            'Test 1' +
            '</template>' +
            '<template id="template2">' +
            'Test 2' +
            '</template>' +
            '<div id="div1"></div>' +
            '<div id="div2"></div>';
    });
};

/**
 * Registers shared hasFragment behavior tests.
 * @param {((nodes: string) => boolean)} hasFragment The browser callback for hasFragment.
 */
export function hasFragmentTests(hasFragment) {
    test('returns true if any node has a document fragment', async ({ page }) => {
        expect(await page.evaluate(hasFragment, 'template')).toBe(true);
    });

    test('returns false if no nodes have a document fragment', async ({ page }) => {
        expect(await page.evaluate(hasFragment, 'div')).toBe(false);
    });

    test('returns false for meta nodes with content', async ({ page }) => {
        await page.evaluate((_) => {
            document.head.innerHTML = '<meta name="description" content="Test">';
        });

        expect(await page.evaluate(hasFragment, 'meta')).toBe(false);
    });
}
