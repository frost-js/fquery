/** @import { Page } from '@playwright/test'; */
/** @import { NodeFilterInput } from '../../../../src/filters.js'; */
/** @import { NodeInput } from '../../../../src/helpers.js'; */

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
            '<div id="div1" class="test"></div>' +
            '<div id="div2"></div>' +
            '<div id="div3" class="test"></div>' +
            '<div id="div4"></div>';
    });
};

/**
 * Registers shared is behavior tests.
 * @param {((args: [NodeInput, NodeFilterInput]) => boolean)} is The browser callback for is.
 */
export function isTests(is) {
    test('returns true if any node matches a filter', async ({ page }) => {
        expect(await page.evaluate(is, ['div', '.test'])).toBe(true);
    });

    test('returns false if no nodes match a filter', async ({ page }) => {
        expect(await page.evaluate(is, ['div:not(.test)', '.test'])).toBe(false);
    });

    test.describe('filter inputs', () => {
        for (const [name, createArgs] of [
            ['function', () => ['div', (node) => node.classList.contains('test')]],
            ['HTMLElement', () => ['div', document.getElementById('div1')]],
            ['NodeList', () => ['div', document.querySelectorAll('div')]],
            ['HTMLCollection', () => ['div', document.body.children]],
            ['DocumentFragment', () => {
                const fragment = document.createDocumentFragment();

                return [[fragment], fragment];
            }],
            ['ShadowRoot', () => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });

                return [[shadow], shadow];
            }],
            ['array', () => ['div', [document.getElementById('div1'), document.getElementById('div2'), document.getElementById('div3'), document.getElementById('div4')]]],
        ]) {
            test(`works with ${name} filter`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);

                expect(await page.evaluate(is, args)).toBe(true);
            });
        }
    });
}
