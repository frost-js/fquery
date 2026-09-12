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
        document.body.innerHTML =
            '<div id="div1"></div>' +
            '<div id="div2"></div>' +
            '<div id="div3"></div>' +
            '<div id="div4"></div>';
    });
};

/**
 * Registers shared sort behavior tests.
 * @param {((nodes: NodeInput) => Array<string>)} sort The browser callback for sort.
 */
export function sortTests(sort) {
    test.describe('ordering', () => {
        test('sorts mixed node types', async ({ page }) => {
            const nodes = await page.evaluateHandle(() => {
                const template = document.createElement('template');
                const fragment = template.content;
                fragment.id = 'fragment';
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                shadow.id = 'shadow';
                document.body.insertBefore(template, document.body.firstChild);
                document.body.insertBefore(div, document.body.firstChild);

                return [
                    fragment,
                    document.getElementById('div3'),
                    document.getElementById('div4'),
                    document.getElementById('div2'),
                    document.getElementById('div1'),
                    shadow,
                    document,
                    window,
                ];
            });
            const ids = await page.evaluate(sort, nodes);

            expect(ids).toEqual([
                'fragment',
                'shadow',
                'div1',
                'div2',
                'div3',
                'div4',
                'document',
                'window',
            ]);
        });

        test('sorts reversed nodes within a detached tree', async ({ page }) => {
            const nodes = await page.evaluateHandle(() => {
                const parent = document.createElement('div');
                const node1 = document.getElementById('div1');
                const node2 = document.getElementById('div2');

                parent.appendChild(node1);
                parent.appendChild(node2);

                return [node2, node1];
            });
            const ids = await page.evaluate(sort, nodes);

            expect(ids).toEqual([
                'div1',
                'div2',
            ]);
        });

        test('preserves the order of nodes in separate detached trees', async ({ page }) => {
            const nodes = await page.evaluateHandle(() => {
                const node1 = document.getElementById('div1');
                const node2 = document.getElementById('div2');

                node1.remove();
                node2.remove();

                return [node2, node1];
            });
            const ids = await page.evaluate(sort, nodes);

            expect(ids).toEqual([
                'div2',
                'div1',
            ]);
        });
    });
}
