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
        document.body.innerHTML = '<div id="parent1"><span id="span1"><a></a></span><span id="span2" class="span"><a></a></span><span id="span3"><a></a></span><span id="span4"><a></a></span></div><div id="parent2"><span id="span5"><a></a></span><span id="span6" class="span"><a></a></span><span id="span7"><a></a></span><span id="span8"><a></a></span></div>';
    });
};

/**
 * Registers shared nextAll behavior tests.
 * @param {((args: [string, (NodeFilterInput|null)?, NodeFilterInput?]) => Array<string>)} nextAll The browser callback for nextAll.
 */
export function nextAllTests(nextAll) {
    test('returns all next siblings of each node', async ({ page }) => {
        const ids = await page.evaluate(nextAll, ['.span']);

        expect(ids).toEqual([
            'span3',
            'span4',
            'span7',
            'span8',
        ]);
    });

    test('returns all next siblings of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate(nextAll, ['.span', '#span4, #span8']);

        expect(ids).toEqual([
            'span4',
            'span8',
        ]);
    });

    test('returns all next siblings of each node before a limit', async ({ page }) => {
        const ids = await page.evaluate(nextAll, ['.span', null, '#span4, #span7']);

        expect(ids).toEqual([
            'span3',
        ]);
    });

    test.describe('filter inputs', () => {
        for (const [name, createArgs, expected] of [
            ['function', () => ['.span', (node) => node.id === 'span8'], ['span8']],
            ['HTMLElement', () => ['.span', document.getElementById('span4')], ['span4']],
            ['NodeList', () => ['.span', document.querySelectorAll('#span4, #span8')], ['span4', 'span8']],
            ['HTMLCollection', () => ['.span', document.getElementById('parent2').children], ['span7', 'span8']],
            ['array', () => ['.span', [document.getElementById('span4'), document.getElementById('span8')]], ['span4', 'span8']],
        ]) {
            test(`works with ${name} filter`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);
                const ids = await page.evaluate(nextAll, args);

                expect(ids).toEqual(expected);
            });
        }
    });

    test.describe('limit inputs', () => {
        for (const [name, createArgs, expected] of [
            ['function', () => ['.span', null, (node) => node.id === 'span7'], ['span3', 'span4']],
            ['HTMLElement', () => ['.span', null, document.getElementById('span7')], ['span3', 'span4']],
            ['NodeList', () => ['.span', null, document.querySelectorAll('#span4, #span7')], ['span3']],
            ['HTMLCollection', () => ['.span', null, document.getElementById('parent2').children], ['span3', 'span4']],
            ['array', () => ['.span', null, [document.getElementById('span4'), document.getElementById('span7')]], ['span3']],
        ]) {
            test(`works with ${name} limit`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);
                const ids = await page.evaluate(nextAll, args);

                expect(ids).toEqual(expected);
            });
        }
    });
}
