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
    await page.evaluate((_) => {
        document.body.innerHTML =
            '<div id="test1" style="display: block; height: 1000px; width: 1200px; margin: 50px; padding: 25px; border: 1px solid grey; overflow-y: scroll;">' +
            '<div style="display: block; width: 1px; height: 2500px;"></div>' +
            '</div>' +
            '<div id="test2"></div>';
    });
};

/**
 * Registers shared height behavior tests.
 * @param {((args: [string, SizeOptions?]) => (number|undefined))} height The browser callback for height.
 */
export function heightTests(height) {
    test('returns the height of the first node', async ({ page }) => {
        expect(await page.evaluate(height, ['div'])).toBe(1050);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(height, ['#invalid'])).toBe(undefined);
    });

    test.describe('box sizes', () => {
        for (const [name, createArgs, expected] of [
            ['content', () => ['div', { boxSize: $.CONTENT_BOX }], 1000],
            ['border', () => ['div', { boxSize: $.BORDER_BOX }], 1052],
            ['margin', () => ['div', { boxSize: $.MARGIN_BOX }], 1152],
            ['scroll', () => ['div', { boxSize: $.SCROLL_BOX }], 2550],
        ]) {
            test(`returns the ${name} box height of the first node`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);

                expect(await page.evaluate(height, args)).toBe(expected);
            });
        }

        test('returns zero content box height for a hidden element with padding', async ({ page }) => {
            const args = await page.evaluateHandle(() => {
                document.getElementById('test1').style.cssText = 'display: none; padding: 10px;';

                return ['#test1', { boxSize: $.CONTENT_BOX }];
            });

            expect(await page.evaluate(height, args)).toBe(0);
        });

        test('returns the border box height of an SVG element', async ({ page }) => {
            const args = await page.evaluateHandle(() => {
                document.body.innerHTML = '<svg style="display: block; width: 100px; height: 100px; padding: 10px; border: 2px solid; box-sizing: content-box;"></svg>';

                return ['svg', { boxSize: $.BORDER_BOX }];
            });

            expect(await page.evaluate(height, args)).toBe(124);
        });
    });
}
