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
        document.body.innerHTML = '<div id="parent1"><span id="span1"><a></a></span><span id="span2"><a></a></span><span id="span3" class="span"><a></a></span><span id="span4"><a></a></span><span id="span5"><a></a></span></div><div id="parent2"><span id="span6"><a></a></span><span id="span7"><a></a></span><span id="span8" class="span"><a></a></span><span id="span9"><a></a></span><span id="span10"><a></a></span></div>';
    });
};

/**
 * Registers shared siblings behavior tests.
 * @param {((args: [string, NodeFilterInput?]) => Array<string>)} siblings The browser callback for siblings.
 */
export function siblingsTests(siblings) {
    test('returns all siblings of each node', async ({ page }) => {
        const ids = await page.evaluate(siblings, ['.span']);

        expect(ids).toEqual([
            'span1',
            'span2',
            'span4',
            'span5',
            'span6',
            'span7',
            'span9',
            'span10',
        ]);
    });

    test('returns all siblings of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate(siblings, ['.span', '#span1, #span10']);

        expect(ids).toEqual([
            'span1',
            'span10',
        ]);
    });

    test.describe('filter inputs', () => {
        for (const [name, createArgs, expected] of [
            ['function', () => ['.span', (node) => node.id === 'span5'], ['span5']],
            ['HTMLElement', () => ['.span', document.getElementById('span1')], ['span1']],
            ['NodeList', () => ['.span', document.querySelectorAll('#span1, #span10')], ['span1', 'span10']],
            ['HTMLCollection', () => ['.span', document.getElementById('parent2').children], ['span6', 'span7', 'span9', 'span10']],
            ['array', () => ['.span', [document.getElementById('span1'), document.getElementById('span10')]], ['span1', 'span10']],
        ]) {
            test(`works with ${name} filter`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);
                const ids = await page.evaluate(siblings, args);

                expect(ids).toEqual(expected);
            });
        }
    });
}
