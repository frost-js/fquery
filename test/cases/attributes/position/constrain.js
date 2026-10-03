/** @import { Page } from '@playwright/test'; */
/** @import { constrain } from '../../../../src/attributes/position.js'; */

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
 * @param {() => typeof constrain} createConstrain Creates the browser-side method adapter.
 */
export function constrainTests(createConstrain) {
    test('constrains each node inside another node', async ({ page }) => {
        const operation = await page.evaluateHandle(createConstrain);

        await operation.evaluate((operation, args) => operation(...args), ['[data-toggle="from"]', '[data-toggle="to"]']);
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

    test.describe('shadowed properties', () => {
        test('recalculates positions when the context root has a control named scrollHeight', async ({ page }) => {
            const operation = await page.evaluateHandle(createConstrain);

            expect(await page.evaluate((operation) => {
                const form = document.createElement('form');
                form.style.cssText = 'display: flex; flex-direction: row; align-items: flex-start; margin: 0;';
                form.innerHTML =
                    '<input type="hidden" name="scrollHeight">' +
                    '<div id="test" style="flex-shrink: 0; width: 2000px; height: 2000px;"></div>' +
                    '<div id="container" style="flex-shrink: 0; width: 100px; height: 100px;"></div>';
                document.body.replaceChildren(form);
                const node = document.getElementById('test');
                const container = document.getElementById('container');
                // Use the form as the context root while retaining a normal HTML document for layout.
                $.setContext({
                    nodeType: Node.DOCUMENT_NODE,
                    documentElement: form,
                });
                operation(node, container);
                return node.style.left;
            }, operation)).toBe('100px');
        });

        test('recalculates positions when the context root has a control named scrollWidth', async ({ page }) => {
            const operation = await page.evaluateHandle(createConstrain);

            expect(await page.evaluate((operation) => {
                const form = document.createElement('form');
                form.style.cssText = 'display: flex; flex-direction: column; align-items: flex-start; margin: 0;';
                form.innerHTML =
                    '<input type="hidden" name="scrollWidth">' +
                    '<div id="test" style="flex-shrink: 0; width: 2000px; height: 2000px;"></div>' +
                    '<div id="container" style="flex-shrink: 0; width: 100px; height: 100px;"></div>';
                document.body.replaceChildren(form);
                const node = document.getElementById('test');
                const container = document.getElementById('container');
                // Use the form as the context root while retaining a normal HTML document for layout.
                $.setContext({
                    nodeType: Node.DOCUMENT_NODE,
                    documentElement: form,
                });
                operation(node, container);
                return node.style.top;
            }, operation)).toBe('100px');
        });
    });

    test.describe('box model', () => {
        for (const boxSizing of ['content-box', 'border-box']) {
            for (const [dimension, width, height] of [
                ['width', 600, 100],
                ['height', 100, 600],
            ]) {
                test(`constrains the ${dimension} of ${boxSizing} nodes with padding and borders`, async ({ page }) => {
                    const operation = await page.evaluateHandle(createConstrain);

                    const node = await page.evaluateHandle(([boxSizing, width, height]) => {
                        const node = document.getElementById('test1');
                        node.style.cssText = `box-sizing: ${boxSizing}; width: ${width}px; height: ${height}px; padding: 10.25px 20.5px; border: 2px solid;`;
                        return node;
                    }, [boxSizing, width, height]);

                    await operation.evaluate((operation, args) => operation(...args), [node, '#test3']);

                    const size = await node.evaluate((node, dimension) =>
                        node.getBoundingClientRect()[dimension], dimension);

                    expect(size).toBe(500);
                });
            }
        }
    });
}
