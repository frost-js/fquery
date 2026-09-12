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
        document.body.innerHTML = '<div id="div1"><span id="span1"><a id="a1"></a></span></div><div id="div2"></div><div id="div3"><span id="span2"><a id="a2"></a></span></div><div id="div4"></div>';
    });
};

/**
 * Registers shared withDescendent behavior tests.
 * @param {((args: [NodeInput, NodeFilterInput?]) => Array<string>)} withDescendent The browser callback for withDescendent.
 */
export function withDescendentTests(withDescendent) {
    test('returns nodes with a descendent matching a filter', async ({ page }) => {
        const ids = await page.evaluate(withDescendent, ['div', 'a']);

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('returns nodes with a descendent without a filter', async ({ page }) => {
        const ids = await page.evaluate(withDescendent, ['div']);

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test.describe('filter inputs', () => {
        for (const [name, createArgs, expected] of [
            ['function', () => ['div', (node) => node.id === 'a1'], ['div1']],
            ['HTMLElement', () => ['div', document.getElementById('a1')], ['div1']],
            ['NodeList', () => ['div', document.querySelectorAll('a')], ['div1', 'div3']],
            ['HTMLCollection', () => ['div', document.getElementById('span1').children], ['div1']],
            ['array', () => ['div', [document.getElementById('a1'), document.getElementById('a2')]], ['div1', 'div3']],
        ]) {
            test(`works with ${name} filter`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);
                const ids = await page.evaluate(withDescendent, args);

                expect(ids).toEqual(expected);
            });
        }
    });

    test.describe('self-exclusion', () => {
        test('does not match the node itself with an HTMLElement filter', async ({ page }) => {
            const args = await page.evaluateHandle(() => {
                const node = document.getElementById('div1');

                return [node, node];
            });
            const ids = await page.evaluate(withDescendent, args);

            expect(ids).toEqual([]);
        });

        test('does not match the node itself with an array filter', async ({ page }) => {
            const args = await page.evaluateHandle(() => {
                const node = document.getElementById('div1');

                return [node, [node]];
            });
            const ids = await page.evaluate(withDescendent, args);

            expect(ids).toEqual([]);
        });

        test('matches a descendent when the array filter also contains the node itself', async ({ page }) => {
            const args = await page.evaluateHandle(() => {
                const node = document.getElementById('div1');
                const child = document.getElementById('span1');

                return [node, [node, child]];
            });
            const ids = await page.evaluate(withDescendent, args);

            expect(ids).toEqual([
                'div1',
            ]);
        });
    });
}
