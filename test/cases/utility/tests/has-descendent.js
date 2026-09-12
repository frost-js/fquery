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
    await page.evaluate((_) => {
        document.body.innerHTML =
            '<div id="div1" class="test">' +
            '<span id="span1">' +
            '<a id="a1"></a>' +
            '</span>' +
            '</div>' +
            '<div id="div2"></div>' +
            '<div id="div3" class="test">' +
            '<span id="span2">' +
            '<a id="a2"></a>' +
            '</span>' +
            '</div>' +
            '<div id="div4"></div>';
    });
};

/**
 * Registers shared hasDescendent behavior tests.
 * @param {((args: [NodeInput, NodeFilterInput?]) => boolean)} hasDescendent The browser callback for hasDescendent.
 */
export function hasDescendentTests(hasDescendent) {
    test('returns true if any node has a descendent matching a filter', async ({ page }) => {
        expect(await page.evaluate(hasDescendent, ['div', 'a'])).toBe(true);
    });

    test('returns true if any node has a descendent without a filter', async ({ page }) => {
        expect(await page.evaluate(hasDescendent, ['div'])).toBe(true);
    });

    test('returns false if no nodes have a descendent matching a filter', async ({ page }) => {
        expect(await page.evaluate(hasDescendent, ['div:not(.test)', 'a'])).toBe(false);
    });

    test('returns false if no nodes have a descendent without a filter', async ({ page }) => {
        expect(await page.evaluate(hasDescendent, ['div:not(.test)'])).toBe(false);
    });

    test.describe('filter inputs', () => {
        for (const [name, createArgs] of [
            ['function', () => ['div', (node) => node.id === 'a1']],
            ['HTMLElement', () => ['div', document.getElementById('a1')]],
            ['NodeList', () => ['div', document.querySelectorAll('a')]],
            ['HTMLCollection', () => ['div', document.getElementById('span1').children]],
            ['array', () => ['div', [document.getElementById('a1'), document.getElementById('a2')]]],
        ]) {
            test(`works with ${name} filter`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);

                expect(await page.evaluate(hasDescendent, args)).toBe(true);
            });
        }
    });

    test.describe('self-exclusion', () => {
        test('does not match the node itself with an HTMLElement filter', async ({ page }) => {
            const args = await page.evaluateHandle(() => {
                const node = document.getElementById('div1');

                return [node, node];
            });

            expect(await page.evaluate(hasDescendent, args)).toBe(false);
        });

        test('does not match the node itself with an array filter', async ({ page }) => {
            const args = await page.evaluateHandle(() => {
                const node = document.getElementById('div1');

                return [node, [node]];
            });

            expect(await page.evaluate(hasDescendent, args)).toBe(false);
        });

        test('matches a descendent when the array filter also contains the node itself', async ({ page }) => {
            const args = await page.evaluateHandle(() => {
                const node = document.getElementById('div1');
                const child = document.getElementById('span1');

                return [node, [node, child]];
            });

            expect(await page.evaluate(hasDescendent, args)).toBe(true);
        });
    });
}
