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
            '<div id="fromParent">' +
            '<div id="test1" data-toggle="from" style="display: block; width: 600px; height: 600px;"></div>' +
            '<div id="test2" data-toggle="from" style="display: block; width: 600px; height: 600px;"></div>' +
            '</div>' +
            '<div id="toParent">' +
            '<div id="test3" data-toggle="to" style="position: absolute; top: 300px; left: 300px; width: 500px; height: 500px;"></div>' +
            '<div data-togle="to"></div>' +
            '</div>';
    });
};

/**
 * Registers shared constrain behavior tests.
 * @param {((args: [string|Element, string]) => void)} constrain The browser callback for constrain.
 */
export function constrainTests(constrain) {
    test('constrains each node inside another node', async ({ page }) => {
        await page.evaluate(constrain, ['[data-toggle="from"]', '[data-toggle="to"]']);
        const html = await page.evaluate(() => document.body.innerHTML);

        expect(html).toBe('<div id="fromParent">' +
            '<div id="test1" data-toggle="from" style="display: block; width: 500px; height: 500px; left: 292px; top: 292px; position: relative;"></div>' +
            '<div id="test2" data-toggle="from" style="display: block; width: 500px; height: 500px; left: 292px; top: -208px; position: relative;"></div>' +
            '</div>' +
            '<div id="toParent">' +
            '<div id="test3" data-toggle="to" style="position: absolute; top: 300px; left: 300px; width: 500px; height: 500px;"></div>' +
            '<div data-togle="to"></div>' +
            '</div>');
    });

    test.describe('box model', () => {
        for (const boxSizing of ['content-box', 'border-box']) {
            for (const [dimension, width, height] of [
                ['width', 600, 100],
                ['height', 100, 600],
            ]) {
                test(`constrains the ${dimension} of ${boxSizing} nodes with padding and borders`, async ({ page }) => {
                    const node = await page.evaluateHandle(([boxSizing, width, height]) => {
                        const node = document.getElementById('test1');
                        node.style.cssText = `box-sizing: ${boxSizing}; width: ${width}px; height: ${height}px; padding: 10.25px 20.5px; border: 2px solid;`;
                        return node;
                    }, [boxSizing, width, height]);

                    await page.evaluate(constrain, [node, '#test3']);

                    const size = await node.evaluate((node, dimension) =>
                        node.getBoundingClientRect()[dimension], dimension);

                    expect(size).toBe(500);
                });
            }
        }
    });
}
