/** @import { Page } from '@playwright/test'; */
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
        document.body.innerHTML = '<div id="div1"></div><div id="div2"></div><div id="div3"></div><div id="div4"></div>';
    });
};

/**
 * Registers shared same behavior tests.
 * @param {((args: [NodeInput, NodeInput]) => Array<string>)} same The browser callback for same.
 */
export function sameTests(same) {
    test('returns nodes identical to other nodes', async ({ page }) => {
        const ids = await page.evaluate(same, ['div', '#div2, #div4']);

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test.describe('comparison inputs', () => {
        for (const [name, createArgs, expected] of [
            ['HTMLElement', () => ['div', document.getElementById('div2')], ['div2']],
            ['NodeList', () => ['div', document.querySelectorAll('#div2, #div4')], ['div2', 'div4']],
            ['HTMLCollection', () => ['div', document.body.children], ['div1', 'div2', 'div3', 'div4']],
            ['DocumentFragment', () => {
                const fragment = document.createDocumentFragment();
                fragment.id = 'fragment';

                return [[fragment], fragment];
            }, ['fragment']],
            ['ShadowRoot', () => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                shadow.id = 'shadow';

                return [[shadow], shadow];
            }, ['shadow']],
            ['array', () => ['div', [document.querySelector('#div2'), document.querySelector('#div4')]], ['div2', 'div4']],
        ]) {
            test(`works with ${name} other nodes`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);
                const ids = await page.evaluate(same, args);

                expect(ids).toEqual(expected);
            });
        }
    });
}
