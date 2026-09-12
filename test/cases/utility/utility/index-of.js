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
            '<div id="div1"></div>' +
            '<div id="div2" class="test"></div>' +
            '<div id="div3"></div>' +
            '<div id="div4" class="test"></div>';
    });
};

/**
 * Registers shared indexOf behavior tests.
 * @param {((args: [NodeInput, NodeFilterInput?]) => number)} indexOf The browser callback for indexOf.
 */
export function indexOfTests(indexOf) {
    test('returns the index of the first node', async ({ page }) => {
        expect(await page.evaluate(indexOf, ['div'])).toBe(0);
    });

    test('returns the index of the first node matching a filter', async ({ page }) => {
        expect(await page.evaluate(indexOf, ['div', '.test'])).toBe(1);
    });

    test.describe('filter inputs', () => {
        for (const [name, createArgs, expected] of [
            ['function', () => ['div', (node) => node.id === 'div2'], 1],
            ['HTMLElement', () => ['div', document.getElementById('div2')], 1],
            ['NodeList', () => ['div', document.querySelectorAll('.test')], 1],
            ['HTMLCollection', () => ['div', document.body.children], 0],
            ['DocumentFragment', () => {
                const fragment = document.createDocumentFragment();

                return [[document.getElementById('div2'), document.getElementById('div4'), fragment], fragment];
            }, 2],
            ['ShadowRoot', () => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });

                return [[document.getElementById('div2'), document.getElementById('div4'), shadow], shadow];
            }, 2],
            ['array', () => ['div', [document.getElementById('div2'), document.getElementById('div4')]], 1],
        ]) {
            test(`works with ${name} filter`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);

                expect(await page.evaluate(indexOf, args)).toBe(expected);
            });
        }
    });
}
