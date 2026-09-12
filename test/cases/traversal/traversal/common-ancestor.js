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
    await page.evaluate(() => {
        document.body.innerHTML = '<div id="parent"><div id="child"><span id="span1"><a id="a1"></a></span><span id="span2"><a id="a2"></a></span></div></div>';
    });
};

/**
 * Registers shared commonAncestor behavior tests.
 * @param {((nodes: NodeInput) => Array<string>)} commonAncestor The browser callback for commonAncestor.
 */
export function commonAncestorTests(commonAncestor) {
    test('returns the closest common ancestor of all nodes', async ({ page }) => {
        const result = await page.evaluate(commonAncestor, 'a');

        expect(result).toEqual(['child']);
    });

    test('returns the parent when a node and its descendant are selected', async ({ page }) => {
        const nodes = await page.evaluateHandle(() => {
            return [
                document.getElementById('a1'),
                document.getElementById('span1'),
            ];
        });
        const result = await page.evaluate(commonAncestor, nodes);

        expect(result).toEqual(['child']);
    });

    test.describe('detached trees', () => {
        test('returns the common ancestor within a detached tree', async ({ page }) => {
            const nodes = await page.evaluateHandle(() => {
                const parent = document.getElementById('parent');
                parent.remove();

                return parent.querySelectorAll('a');
            });
            const result = await page.evaluate(commonAncestor, nodes);

            expect(result).toEqual(['child']);
        });

        test('returns the common ancestor for reversed nodes within a detached tree', async ({ page }) => {
            const nodes = await page.evaluateHandle(() => {
                const parent = document.getElementById('parent');
                const node1 = document.getElementById('a1');
                const node2 = document.getElementById('a2');
                parent.remove();

                return [node2, node1];
            });
            const result = await page.evaluate(commonAncestor, nodes);

            expect(result).toEqual(['child']);
        });
    });
}
