/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML =
            '<div id="select">' +
            '<div id="div1">' +
            '<span id="span1">Test 1</span>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">Test 2</span>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '<div class="outer">' +
            '<div class="inner"></div>' +
            '</div>' +
            '</div>';

        const range = document.createRange();
        const span1 = document.getElementById('span1');
        const span2 = document.getElementById('span2');
        range.setStart(span1.firstChild, 3);
        range.setEnd(span2.firstChild, 3);

        const selection = document.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    });
};

/**
 * Registers shared wrapSelection behavior tests.
 * @param {((args: [string|Array<Node>]) => void)} wrapSelection The browser callback for wrapSelection.
 */
export function wrapSelectionTests(wrapSelection) {
    test('wraps selected nodes', async ({ page }) => {
        await page.evaluate(wrapSelection, ['.outer']);
        const html = await page.evaluate(() => document.body.innerHTML);

        expect(html).toBe('<div id="select">' +
            '<div id="div1">' +
            '<span id="span1">Tes</span>' +
            '</div>' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<div id="div1">' +
            '<span id="span1">t 1</span>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">Tes</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">t 2</span>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '</div>');
    });

    test('preserves the order of multiple wrapper nodes', async ({ page }) => {
        const nodes = await page.evaluateHandle(() => [
            document.querySelector('.outer'),
            document.createElement('section'),
        ]);
        await page.evaluate(wrapSelection, [nodes]);
        const html = await page.evaluate(() => document.body.innerHTML);

        expect(html).toBe('<div id="select">' +
            '<div id="div1">' +
            '<span id="span1">Tes</span>' +
            '</div>' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<div id="div1">' +
            '<span id="span1">t 1</span>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">Tes</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<section></section>' +
            '<div id="div2">' +
            '<span id="span2">t 2</span>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '</div>');
    });

    test.describe('empty inputs', () => {
        for (const [name, nodes] of [
            ['an empty array', []],
            ['an unmatched selector', '.missing'],
        ]) {
            test(`preserves the selection with ${name}`, async ({ page }) => {
                await page.evaluate(wrapSelection, [nodes]);
                const selectedText = await page.evaluate(() => {
                    const selection = document.getSelection();
                    const range = selection.getRangeAt(0);
                    return range.toString();
                });

                expect(selectedText).toBe('t 1Tes');
            });
        }
    });
}
