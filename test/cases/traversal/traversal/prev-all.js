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
        document.body.innerHTML = '<div id="parent1"><span id="span1"><a></a></span><span id="span2"><a></a></span><span id="span3" class="span"><a></a></span><span id="span4"><a></a></span></div><div id="parent2"><span id="span5"><a></a></span><span id="span6"><a></a></span><span id="span7" class="span"><a></a></span><span id="span8"><a></a></span></div>';
    });
};

/**
 * Registers shared prevAll behavior tests.
 * @param {((args: [string, (NodeFilterInput|null)?, NodeFilterInput?]) => Array<string>)} prevAll The browser callback for prevAll.
 */
export function prevAllTests(prevAll) {
    test('returns all previous siblings of each node', async ({ page }) => {
        const ids = await page.evaluate(prevAll, ['.span']);

        expect(ids).toEqual([
            'span1',
            'span2',
            'span5',
            'span6',
        ]);
    });

    test('returns all previous siblings of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate(prevAll, ['.span', '#span1, #span5']);

        expect(ids).toEqual([
            'span1',
            'span5',
        ]);
    });

    test.describe('filter inputs', () => {
        for (const [name, createArgs, expected] of [
            ['function', () => ['.span', (node) => node.id === 'span5'], ['span5']],
            ['HTMLElement', () => ['.span', document.getElementById('span1')], ['span1']],
            ['NodeList', () => ['.span', document.querySelectorAll('#span1, #span5')], ['span1', 'span5']],
            ['HTMLCollection', () => ['.span', document.getElementById('parent2').children], ['span5', 'span6']],
            ['array', () => ['.span', [document.getElementById('span1'), document.getElementById('span5')]], ['span1', 'span5']],
        ]) {
            test(`works with ${name} filter`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);
                const ids = await page.evaluate(prevAll, args);

                expect(ids).toEqual(expected);
            });
        }
    });

    test.describe('limit inputs', () => {
        for (const [name, createArgs, expected] of [
            ['function', () => ['.span', null, (node) => node.id === 'span6'], ['span1', 'span2']],
            ['HTMLElement', () => ['.span', null, document.getElementById('span6')], ['span1', 'span2']],
            ['NodeList', () => ['.span', null, document.querySelectorAll('#span1, #span6')], ['span2']],
            ['HTMLCollection', () => ['.span', null, document.getElementById('parent2').children], ['span1', 'span2']],
            ['array', () => ['.span', null, [document.getElementById('span1'), document.getElementById('span6')]], ['span2']],
        ]) {
            test(`works with ${name} limit`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);
                const ids = await page.evaluate(prevAll, args);

                expect(ids).toEqual(expected);
            });
        }
    });
}
