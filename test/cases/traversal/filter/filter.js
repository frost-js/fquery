/** @import { Page } from '@playwright/test'; */
/** @import { NodeFilterInput } from '../../../../src/filters.js'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML = '<div id="div1"></div><div id="div2" data-filter="test"></div><div id="div3"></div><div id="div4" data-filter="test"></div>';
    });
};

/**
 * Registers shared filter filter-input tests.
 * @param {((args: [string|Array<Node>, NodeFilterInput]) => Array<string>)} filter The browser callback for filter.
 */
export function filterTests(filter) {
    for (const [name, createArgs, expected] of [
        ['function', () => ['div', (node) => node.dataset.filter === 'test'], ['div2', 'div4']],
        ['HTMLElement', () => ['div', document.getElementById('div2')], ['div2']],
        ['NodeList', () => ['div', document.querySelectorAll('[data-filter="test"]')], ['div2', 'div4']],
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
        ['array', () => ['div', [document.getElementById('div2'), document.getElementById('div4')]], ['div2', 'div4']],
    ]) {
        test(`works with ${name} filter`, async ({ page }) => {
            const args = await page.evaluateHandle(createArgs);
            const result = await page.evaluate(filter, args);

            expect(result).toEqual(expected);
        });
    }
}
