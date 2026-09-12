/** @import { NodeFilterInput } from '../../../../src/filters.js'; */

import { expect, test } from '#test';

export { setup } from './not.js';

/**
 * Registers shared notOne filter-input tests.
 * @param {((args: [string|Array<Node>, NodeFilterInput]) => (string|null|Array<string>))} notOne The browser callback for notOne.
 * @param {object} [options] The test options.
 * @param {boolean} [options.querySet=false] Whether the callback returns an array of QuerySet node IDs.
 */
export function notOneTests(notOne, { querySet = false } = {}) {
    for (const [name, createArgs, expected] of [
        ['function', () => ['div', (node) => node.dataset.filter === 'test'], 'div2'],
        ['HTMLElement', () => ['div', document.getElementById('div1')], 'div2'],
        ['NodeList', () => ['div', document.querySelectorAll('[data-filter="test"]')], 'div2'],
        ['HTMLCollection', () => ['div', document.body.children], null],
        ['DocumentFragment', () => {
            const fragment = document.createDocumentFragment();
            fragment.id = 'fragment';
            return [[fragment], fragment];
        }, null],
        ['ShadowRoot', () => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            shadow.id = 'shadow';
            return [[shadow], shadow];
        }, null],
        ['array', () => ['div', [document.getElementById('div1'), document.getElementById('div3')]], 'div2'],
    ]) {
        test(`works with ${name} filter`, async ({ page }) => {
            const args = await page.evaluateHandle(createArgs);
            const result = await page.evaluate(notOne, args);

            const expectedIds = expected === null ? [] : [expected];
            const expectedResult = querySet ? expectedIds : expected;
            expect(result).toEqual(expectedResult);
        });
    }
}
