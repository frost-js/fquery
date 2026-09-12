/** @import { NodeFilterInput } from '../../../../src/filters.js'; */

import { expect, test } from '#test';

export { setup } from './not.js';

/**
 * Registers shared notOne filter-input tests.
 * @param {((args: [string|Array<Node>, NodeFilterInput]) => Array<string>)} notOne The browser callback for notOne.
 */
export function notOneTests(notOne) {
    for (const [name, createArgs, expected] of [
        ['function', () => ['div', (node) => node.dataset.filter === 'test'], ['div2']],
        ['HTMLElement', () => ['div', document.getElementById('div1')], ['div2']],
        ['NodeList', () => ['div', document.querySelectorAll('[data-filter="test"]')], ['div2']],
        ['array', () => ['div', [document.getElementById('div1'), document.getElementById('div3')]], ['div2']],
    ]) {
        test(`works with ${name} filter`, async ({ page }) => {
            const args = await page.evaluateHandle(createArgs);
            const result = await page.evaluate(notOne, args);

            expect(result).toEqual(expected);
        });
    }
}
