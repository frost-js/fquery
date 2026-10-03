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
            '<div id="test1" style="display: block; height: 100px; overflow-y: scroll;">' +
            '<div style="display: block; width: 1px; height: 1000px;"></div>' +
            '</div>' +
            '<div id="test2"></div>';
        document.getElementById('test1').scrollTop = 100;
    });
};

/**
 * Registers shared getScrollY behavior tests.
 * @param {((nodes: NodeInput) => (number|undefined))} getScrollY The browser callback for getScrollY.
 */
export function getScrollYTests(getScrollY) {
    test('returns the scroll Y position of the first node', async ({ page }) => {
        expect(await page.evaluate(getScrollY, 'div')).toBe(100);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(getScrollY, '#invalid')).toBe(undefined);
    });

    test.describe('document and window inputs', () => {
        test('works with Document nodes', async ({ page }) => {
            const doc = await page.evaluateHandle(() => {
                document.body.innerHTML = '<div style="block; width: 1000px; height: 1000px;"></div>';
                document.scrollingElement.scrollTop = 100;

                return document;
            });

            expect(await page.evaluate(getScrollY, doc)).toBe(100);
        });

        test('works with Window nodes', async ({ page }) => {
            const view = await page.evaluateHandle(() => {
                document.body.innerHTML = '<div style="block; width: 1000px; height: 1000px;"></div>';
                window.scrollTo(0, 100);

                return window;
            });

            expect(await page.evaluate(getScrollY, view)).toBe(100);
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
                doc.defaultView.scrollTo(0, 100);

                return doc;
            });

            expect(await page.evaluate(getScrollY, doc)).toBe(100);
        });

        test('returns zero for Document nodes without a scrolling element or window', async ({ page }) => {
            const doc = await page.evaluateHandle(() => {
                const doc = document.implementation.createHTMLDocument('');
                doc.removeChild(doc.documentElement);

                return doc;
            });

            expect(await page.evaluate(getScrollY, doc)).toBe(0);
        });

        test('works with a form document root whose control shadows scrollTop', async ({ page }) => {
            const doc = await page.evaluateHandle(() => {
                const doc = document.implementation.createHTMLDocument('');
                const form = doc.createElement('form');
                form.innerHTML = '<input name="scrollTop">';
                doc.replaceChild(form, doc.documentElement);

                return doc;
            });

            expect(await page.evaluate(getScrollY, doc)).toBe(0);
        });
    });
}
