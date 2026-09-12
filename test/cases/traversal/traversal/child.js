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
        document.body.innerHTML = '<div id="parent1" class="parent"><div id="child1"><span></span></div><div id="child2"><span></span></div><span id="child3"><span></span></span><span id="child4"><span></span></span></div><div id="parent2" class="parent"><div id="child5"><span></span></div><div id="child6"><span></span></div><span id="child7"><span></span></span><span id="child8"><span></span></span></div>';
    });
};

/**
 * Registers shared child behavior tests.
 * @param {((args: [string, NodeFilterInput?]) => Array<string>)} child The browser callback for child.
 */
export function childTests(child) {
    test('returns the first child of each node', async ({ page }) => {
        const ids = await page.evaluate(child, ['.parent']);

        expect(ids).toEqual([
            'child1',
            'child5',
        ]);
    });

    test('returns the first child of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate(child, ['.parent', 'span']);

        expect(ids).toEqual([
            'child3',
            'child7',
        ]);
    });

    test.describe('filter inputs', () => {
        for (const [name, createArgs, expected] of [
            ['function', () => ['.parent', (node) => node.tagName === 'SPAN'], ['child3', 'child7']],
            ['HTMLElement', () => ['.parent', document.getElementById('child3')], ['child3']],
            ['NodeList', () => ['.parent', document.querySelectorAll('span')], ['child3', 'child7']],
            ['HTMLCollection', () => ['.parent', document.getElementById('parent1').children], ['child1']],
            ['array', () => ['.parent', [document.getElementById('child3'), document.getElementById('child4'), document.getElementById('child7'), document.getElementById('child8')]], ['child3', 'child7']],
        ]) {
            test(`works with ${name} filter`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);
                const ids = await page.evaluate(child, args);

                expect(ids).toEqual(expected);
            });
        }
    });
}
