/** @import { Page } from '@playwright/test'; */

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
            '<div id="select">' +
            '<div id="div1">' +
            '<span id="span1">Test 1</span>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">Test 2</span>' +
            '</div>' +
            '</div>' +
            '<div id="parent">' +
            '<a href="#" id="a1">Test</a>' +
            '<a href="#" id="a2">Test</a>' +
            '</div>';

        const range = document.createRange();
        const span1 = document.getElementById('span1');
        const span2 = document.getElementById('span2');
        range.setStartBefore(span1);
        range.setEnd(span2.firstChild, 3);

        const selection = document.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    });
};

/**
 * Registers shared afterSelection behavior tests.
 * @param {((args: [string|Array<Node>]) => void)} afterSelection The browser callback for afterSelection.
 */
export function afterSelectionTests(afterSelection) {
    test('inserts each node after the selected nodes', async ({ page }) => {
        await page.evaluate(afterSelection, ['a']);
        const html = await page.evaluate(() => document.body.innerHTML);

        expect(html).toBe('<div id="select">' +
            '<div id="div1">' +
            '<span id="span1">Test 1</span>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">Tes' +
            '<a href="#" id="a1">Test</a>' +
            '<a href="#" id="a2">Test</a>' +
            't 2</span>' +
            '</div>' +
            '</div>' +
            '<div id="parent"></div>');
    });

    test.describe('empty inputs', () => {
        for (const [name, nodes] of [
            ['an empty array', []],
            ['an unmatched selector', '.missing'],
        ]) {
            test(`preserves the selection with ${name}`, async ({ page }) => {
                await page.evaluate(afterSelection, [nodes]);
                const selectedText = await page.evaluate(() => {
                    const selection = document.getSelection();
                    const range = selection.getRangeAt(0);
                    return range.toString();
                });

                expect(selectedText).toBe('Test 1Tes');
            });
        }
    });
}
