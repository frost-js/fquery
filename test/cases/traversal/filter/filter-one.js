/** @import { NodeFilterInput } from '../../../../src/filters.js'; */

import { expect, test } from '#test';

export { setup } from './filter.js';

/**
 * Registers shared filterOne filter-input tests.
 * @param {((args: [string|Array<Node>, NodeFilterInput]) => (string|null|Array<string>))} filterOne The browser callback for filterOne.
 * @param {object} [options] The test options.
 * @param {boolean} [options.querySet=false] Whether the callback returns an array of QuerySet node IDs.
 */
export function filterOneTests(filterOne, { querySet = false } = {}) {
    for (const [name, createArgs, expected] of [
        ['function', () => ['div', (node) => node.dataset.filter === 'test'], 'div2'],
        ['HTMLElement', () => ['div', document.getElementById('div2')], 'div2'],
        ['NodeList', () => ['div', document.querySelectorAll('[data-filter="test"]')], 'div2'],
        ['HTMLCollection', () => ['div', document.body.children], 'div1'],
        ['DocumentFragment', () => {
            const fragment = document.createDocumentFragment();
            fragment.id = 'fragment';
            return [[fragment], fragment];
        }, 'fragment'],
        ['ShadowRoot', () => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            shadow.id = 'shadow';
            return [[shadow], shadow];
        }, 'shadow'],
        ['array', () => ['div', [document.getElementById('div2'), document.getElementById('div4')]], 'div2'],
    ]) {
        test(`works with ${name} filter`, async ({ page }) => {
            const args = await page.evaluateHandle(createArgs);
            const result = await page.evaluate(filterOne, args);

            const expectedIds = expected === null ? [] : [expected];
            const expectedResult = querySet ? expectedIds : expected;
            expect(result).toEqual(expectedResult);
        });
    }
}
