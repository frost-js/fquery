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
            '<div id="div1">' +
            '<span id="span1">Test 1</span>' +
            '</div>' +
            '<div id="div2" class="select">' +
            '<span id="span2">Test 2</span>' +
            '</div>' +
            '<div id="div3">' +
            '<span id="span3">Test 3</span>' +
            '</div>' +
            '<div id="div4" class="select">' +
            '<span id="span4">Test 4</span>' +
            '</div>' +
            '<div id="div5">' +
            '<span id="span5">Test 5</span>' +
            '</div>' +
            '</div>';
    });
};

/**
 * Registers shared selectAll behavior tests.
 * @param {((args: [NodeInput]) => void)} selectAll The browser callback for selectAll.
 */
export function selectAllTests(selectAll) {
    test.describe('selection behavior', () => {
        test('creates a selection on all nodes', async ({ page }) => {
            await page.evaluate(selectAll, ['.select']);

            const text = await page.evaluate(() => {
                const selection = document.getSelection();
                const range = selection.getRangeAt(0);
                return range.toString();
            });

            expect(text).toBe('Test 2Test 3Test 4');
        });

        test('selects all contents when a node and its descendant are selected', async ({ page }) => {
            const nodes = await page.evaluateHandle(() => {
                const node = document.getElementById('select');
                node.innerHTML = '<span>Test 1</span>Test 2';

                return [node, node.firstChild];
            });

            await page.evaluate(selectAll, [nodes]);

            const text = await page.evaluate(() => {
                const selection = document.getSelection();
                const range = selection.getRangeAt(0);
                return range.toString();
            });

            expect(text).toBe('Test 1Test 2');
        });

        test('selects a range of siblings for getSelection', async ({ page }) => {
            await page.evaluate(selectAll, ['.select']);

            const text = await page.evaluate(() => {
                const selected = $.getSelection();
                return selected.map((node) => node.textContent).join('');
            });

            expect(text).toBe('Test 2Test 3Test 4');
        });

        test('selects text and element siblings for getSelection', async ({ page }) => {
            const nodes = await page.evaluateHandle(() => {
                const node = document.getElementById('select');
                node.innerHTML = 'Test 1<span>Test 2</span>Test 3';

                return [node.firstChild, node.lastChild];
            });

            await page.evaluate(selectAll, [nodes]);

            const text = await page.evaluate(() => {
                const selected = $.getSelection();
                return selected.map((node) => node.textContent).join('');
            });

            expect(text).toBe('Test 1Test 2Test 3');
        });
    });
}
