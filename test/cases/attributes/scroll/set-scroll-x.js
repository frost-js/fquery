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
            '<div id="test1" style="display: block; width: 100px; height: 1px; overflow: scroll;">' +
            '<div style="display: block; width: 1000px; height: 1px;"></div>' +
            '</div>' +
            '<div id="test2" style="display: block; width: 100px; height: 1px; overflow: scroll;">' +
            '<div style="display: block; width: 1000px; height: 1px;"></div>' +
            '</div>';
    });
};

/**
 * Registers shared setScrollX behavior tests.
 * @param {((args: [NodeInput, number]) => void)} setScrollX The browser callback for setScrollX.
 */
export function setScrollXTests(setScrollX) {
    test('sets the scroll X position for all nodes', async ({ page }) => {
        await page.evaluate(setScrollX, ['div', 100]);

        const position = await page.evaluate(() => {
            return [
                document.getElementById('test1').scrollLeft,
                document.getElementById('test2').scrollLeft,
            ];
        });

        expect(position).toEqual([
            100,
            100,
        ]);
    });

    test.describe('document and window inputs', () => {
        test('works with Document nodes', async ({ page }) => {
            const doc = await page.evaluateHandle(() => {
                document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';

                return document;
            });

            await page.evaluate(setScrollX, [doc, 100]);

            const position = await doc.evaluate((doc) => {
                return doc.scrollingElement.scrollLeft;
            });

            expect(position).toBe(100);
        });

        test('works with Window nodes', async ({ page }) => {
            const view = await page.evaluateHandle(() => {
                document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';

                return window;
            });

            await page.evaluate(setScrollX, [view, 100]);

            const position = await view.evaluate((view) => {
                return view.scrollX;
            });

            expect(position).toBe(100);
        });
    });

    test.describe('document fallbacks', () => {
        test('works with Document nodes without a scrolling element and preserves the Y position', async ({ page }) => {
            const doc = await page.evaluateHandle(() => {
                const iframe = document.createElement('iframe');
                document.body.appendChild(iframe);
                const doc = iframe.contentDocument;
                doc.open();
                doc.write('<html style="overflow: auto;"><body style="overflow: auto; width: 1000px; height: 1000px;"></body></html>');
                doc.close();
                doc.defaultView.scrollTo(0, 50);

                return doc;
            });

            await page.evaluate(setScrollX, [doc, 100]);

            const position = await doc.evaluate((doc) => {
                return [
                    doc.defaultView.scrollX,
                    doc.defaultView.scrollY,
                ];
            });

            expect(position).toEqual([100, 50]);
        });

        test('skips Document nodes without a scrolling element or window', async ({ page }) => {
            const nodes = await page.evaluateHandle(() => {
                const doc = document.implementation.createHTMLDocument('');
                doc.removeChild(doc.documentElement);
                const element = document.getElementById('test1');

                return [doc, element];
            });

            await page.evaluate(setScrollX, [nodes, 100]);

            const position = await nodes.evaluate(([, element]) => {
                return element.scrollLeft;
            });

            expect(position).toBe(100);
        });
    });
}
