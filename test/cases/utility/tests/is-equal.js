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
 * @param {((args: [NodeInput, NodeInput, { shallow: boolean }?]) => boolean)} isEqual The browser callback for isEqual.
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

    test.describe('comparison inputs', () => {
        for (const [name, createArgs] of [
            ['HTMLElement', () => ['#parent1 span', document.querySelector('#parent2 > [data-id="span2"]')]],
            ['NodeList', () => ['#parent1 span', document.querySelectorAll('#parent2 > span')]],
            ['HTMLCollection', () => ['#parent1 span', document.getElementById('parent2').children]],
            ['DocumentFragment', () => {
                const fragment1 = document.createDocumentFragment();
                const fragment2 = document.createDocumentFragment();

                return [[fragment1], fragment2];
            }],
            ['ShadowRoot', () => {
                const div1 = document.createElement('div');
                const div2 = document.createElement('div');
                const shadow1 = div1.attachShadow({ mode: 'open' });
                const shadow2 = div2.attachShadow({ mode: 'closed' });

                return [[shadow1], shadow2];
            }],
            ['array', () => ['#parent1 span', [document.querySelector('#parent2 > [data-id="span2"]'), document.querySelector('#parent2 > [data-id="span3"]')]]],
        ]) {
            test(`works with ${name} other nodes`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);

                expect(await page.evaluate(isEqual, args)).toBe(true);
            });
        }
    });
}
