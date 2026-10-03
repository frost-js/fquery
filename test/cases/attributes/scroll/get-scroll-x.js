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
            '<div id="test1" style="display: block; width: 100px; overflow-x: scroll;">' +
            '<div style="display: block; width: 1000px; height: 1px;"></div>' +
            '</div>' +
            '<div id="test2"></div>';
        document.getElementById('test1').scrollLeft = 100;
    });
};

/**
 * Registers shared getScrollX behavior tests.
 * @param {((nodes: NodeInput) => (number|undefined))} getScrollX The browser callback for getScrollX.
 */
export function getScrollXTests(getScrollX) {
    test('returns the scroll X position of the first node', async ({ page }) => {
        expect(await page.evaluate(getScrollX, 'div')).toBe(100);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(getScrollX, '#invalid')).toBe(undefined);
    });

    test.describe('document and window inputs', () => {
        test('works with Document nodes', async ({ page }) => {
            const doc = await page.evaluateHandle(() => {
                document.body.innerHTML = '<div style="block; width: 1000px; height: 1000px;"></div>';
                document.scrollingElement.scrollLeft = 100;

                return document;
            });

            expect(await page.evaluate(getScrollX, doc)).toBe(100);
        });

        test('works with Window nodes', async ({ page }) => {
            const view = await page.evaluateHandle(() => {
                document.body.innerHTML = '<div style="block; width: 1000px; height: 1000px;"></div>';
                window.scrollTo(100, 0);

                return window;
            });

            expect(await page.evaluate(getScrollX, view)).toBe(100);
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
                doc.defaultView.scrollTo(100, 0);

                return doc;
            });

            expect(await page.evaluate(getScrollX, doc)).toBe(100);
        });

        test('returns zero for Document nodes without a scrolling element or window', async ({ page }) => {
            const doc = await page.evaluateHandle(() => {
                const doc = document.implementation.createHTMLDocument('');
                doc.removeChild(doc.documentElement);

                return doc;
            });

            expect(await page.evaluate(getScrollX, doc)).toBe(0);
        });

        test('works with a form document root whose control shadows scrollLeft', async ({ page }) => {
            const doc = await page.evaluateHandle(() => {
                const doc = document.implementation.createHTMLDocument('');
                const form = doc.createElement('form');
                form.innerHTML = '<input name="scrollLeft">';
                doc.replaceChild(form, doc.documentElement);

                return doc;
            });

            expect(await page.evaluate(getScrollX, doc)).toBe(0);
        });
    });
}
