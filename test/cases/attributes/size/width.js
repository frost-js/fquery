/** @import { Page } from '@playwright/test'; */
/** @import { SizeOptions } from '../../../../src/attributes/size.js'; */

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
            '<div id="test1" style="display: block; height: 1000px; width: 1200px; margin: 50px; padding: 25px; border: 1px solid grey; overflow-x: scroll">' +
            '<div style="display: block; height: 1px; width: 2500px;"></div>' +
            '</div>' +
            '<div id="test2"></div>';
    });
};

/**
 * Registers shared width behavior tests.
 * @param {((args: [string, SizeOptions?]) => (number|undefined))} width The browser callback for width.
 */
export function widthTests(width) {
    test('returns the width of the first node', async ({ page }) => {
        expect(await page.evaluate(width, ['div'])).toBe(1250);
    });

    test('measures forms with a control named clientWidth', async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<form style="width: 100px; padding: 0; border: 0;">' +
                '<input type="hidden" name="clientWidth">' +
                '</form>';
        });

        expect(await page.evaluate(width, ['form'])).toBe(100);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(width, ['#invalid'])).toBe(undefined);
    });

    test.describe('box sizes', () => {
        for (const [name, createArgs, expected] of [
            ['content', () => ['div', { boxSize: $.CONTENT_BOX }], 1200],
            ['border', () => ['div', { boxSize: $.BORDER_BOX }], 1252],
            ['margin', () => ['div', { boxSize: $.MARGIN_BOX }], 1352],
            ['scroll', () => ['div', { boxSize: $.SCROLL_BOX }], 2550],
        ]) {
            test(`returns the ${name} box width of the first node`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);

                expect(await page.evaluate(width, args)).toBe(expected);
            });
        }

        test('returns zero content box width for a hidden element with padding', async ({ page }) => {
            const args = await page.evaluateHandle(() => {
                document.getElementById('test1').style.cssText = 'display: none; padding: 10px;';

                return ['#test1', { boxSize: $.CONTENT_BOX }];
            });

            expect(await page.evaluate(width, args)).toBe(0);
        });

        test('returns the border box width of an SVG element', async ({ page }) => {
            const args = await page.evaluateHandle(() => {
                document.body.innerHTML = '<svg style="display: block; width: 100px; height: 100px; padding: 10px; border: 2px solid; box-sizing: content-box;"></svg>';

                return ['svg', { boxSize: $.BORDER_BOX }];
            });

            expect(await page.evaluate(width, args)).toBe(124);
        });
    });
}
