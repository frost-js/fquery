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
        document.body.innerHTML = '<div id="parent"><span id="span1"><a></a></span><span id="span2" class="span"><a></a></span><span id="span3"><a></a></span><span id="span4"><a></a></span></div><div id="parent2"><span id="span5"><a></a></span><span id="span6" class="span"><a></a></span><span id="span7"><a></a></span><span id="span8"><a></a></span></div>';
    });
};

/**
 * Registers shared next behavior tests.
 * @param {((args: [string, NodeFilterInput?]) => Array<string>)} next The browser callback for next.
 */
export function nextTests(next) {
    test('returns the next sibling of each node', async ({ page }) => {
        const ids = await page.evaluate(next, ['.span']);

        expect(ids).toEqual([
            'span3',
            'span7',
        ]);
    });

    test('returns the next sibling of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate(next, ['.span', '#span7']);

        expect(ids).toEqual([
            'span7',
        ]);
    });

    test.describe('filter inputs', () => {
        for (const [name, createArgs, expected] of [
            ['function', () => ['.span', (node) => node.id === 'span7'], ['span7']],
            ['HTMLElement', () => ['.span', document.getElementById('span7')], ['span7']],
            ['NodeList', () => ['.span', document.querySelectorAll('#span7')], ['span7']],
            ['HTMLCollection', () => ['.span', document.getElementById('parent2').children], ['span7']],
            ['array', () => ['.span', [document.getElementById('span3'), document.getElementById('span7')]], ['span3', 'span7']],
        ]) {
            test(`works with ${name} filter`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);
                const ids = await page.evaluate(next, args);

                expect(ids).toEqual(expected);
            });
        }
    });
}
