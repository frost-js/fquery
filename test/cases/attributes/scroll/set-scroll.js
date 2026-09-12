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
            '<div id="test1" style="display: block; width: 100px; height: 100px; overflow: scroll;">' +
            '<div style="display: block; width: 1000px; height: 1000px;"></div>' +
            '</div>' +
            '<div id="test2" style="display: block; width: 100px; height: 100px; overflow: scroll;">' +
            '<div style="display: block; width: 1000px; height: 1000px;"></div>' +
            '</div>';
    });
};

/**
 * Registers shared setScroll behavior tests.
 * @param {((args: [NodeInput, number, number]) => void)} setScroll The browser callback for setScroll.
 */
export function setScrollTests(setScroll) {
    test('sets the scroll position for all nodes', async ({ page }) => {
        await page.evaluate(setScroll, ['div', 100, 50]);

        const position = await page.evaluate(() => {
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            return [
                [
                    element1.scrollLeft,
                    element1.scrollTop,
                ],
                [
                    element2.scrollLeft,
                    element2.scrollTop,
                ],
            ];
        });

        expect(position).toEqual([
            [100, 50],
            [100, 50],
        ]);
    });

    test.describe('document and window inputs', () => {
        test('works with Document nodes', async ({ page }) => {
            const doc = await page.evaluateHandle(() => {
                document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';

                return document;
            });

            await page.evaluate(setScroll, [doc, 100, 50]);

            const position = await doc.evaluate((doc) => {
                return [
                    doc.scrollingElement.scrollLeft,
                    doc.scrollingElement.scrollTop,
                ];
            });

            expect(position).toEqual([100, 50]);
        });

        test('works with Window nodes', async ({ page }) => {
            const view = await page.evaluateHandle(() => {
                document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';

                return window;
            });

            await page.evaluate(setScroll, [view, 100, 50]);

            const position = await view.evaluate((view) => {
                return [
                    view.scrollX,
                    view.scrollY,
                ];
            });

            expect(position).toEqual([100, 50]);
        });
    });

    test.describe('document fallbacks', () => {
        test('works with Document nodes without a scrolling element', async ({ page }) => {
            const doc = await page.evaluateHandle(() => {
                const iframe = document.createElement('iframe');
                document.body.appendChild(iframe);
                const doc = iframe.contentDocument;
                doc.open();
                doc.write('<html style="overflow: auto;"><body style="overflow: auto; width: 1000px; height: 1000px;"></body></html>');
                doc.close();

                return doc;
            });

            await page.evaluate(setScroll, [doc, 100, 50]);

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

            await page.evaluate(setScroll, [nodes, 100, 50]);

            const position = await nodes.evaluate(([, element]) => {
                return [
                    element.scrollLeft,
                    element.scrollTop,
                ];
            });

            expect(position).toEqual([100, 50]);
        });
    });
}
