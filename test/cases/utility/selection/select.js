/** @import { Page } from '@playwright/test'; */
/** @import { NodeInput } from '../../../../src/helpers.js'; */

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
            '<div id="div1" class="select">' +
            '<span id="span1">Test 1</span>' +
            '</div>' +
            '<div id="div2" class="select">' +
            '<span id="span2">Test 2</span>' +
            '</div>' +
            '</div>' +
            '<input id="input" value="Test 3">' +
            '<textarea id="textarea">Test 4</textarea>';
    });
};

/**
 * Registers shared select behavior tests.
 * @param {((args: [NodeInput]) => void)} select The browser callback for select.
 */
export function selectTests(select) {
    test.describe('selection behavior', () => {
        test('creates a selection on the first node', async ({ page }) => {
            await page.evaluate(select, ['.select']);

            const text = await page.evaluate(() => {
                const selection = document.getSelection();
                const range = selection.getRangeAt(0);
                return range.toString();
            });

            expect(text).toBe('Test 1');
        });

        test('selects a middle sibling for getSelection', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('select').innerHTML =
                    '<span id="span1">Test 1</span>' +
                    '<span id="span2">Test 2</span>' +
                    '<span id="span3">Test 3</span>';
            });

            await page.evaluate(select, ['#span2']);

            const text = await page.evaluate(() => {
                const selected = $.getSelection();
                return selected.map((node) => node.textContent).join('');
            });

            expect(text).toBe('Test 2');
        });

        test('selects a text sibling for getSelection', async ({ page }) => {
            const nodes = await page.evaluateHandle(() => {
                const node = document.getElementById('select');
                node.innerHTML = 'Test 1<span>Test 2</span>Test 3';

                return node.firstChild;
            });

            await page.evaluate(select, [nodes]);

            const text = await page.evaluate(() => {
                const selected = $.getSelection();
                return selected.map((node) => node.textContent).join('');
            });

            expect(text).toBe('Test 1');
        });
    });
}
