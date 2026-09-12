/** @import { Page } from '@playwright/test'; */
/** @import { show } from '../../../../src/attributes/styles.js'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML = '<div id="test1" style="display: none;"></div><div id="test2" style="display: none;"></div>';
    });
};

/**
 * Registers shared show behavior tests.
 * @param {() => typeof show} createShow Creates the browser-side method adapter.
 */
export function showTests(createShow) {
    test('shows all nodes', async ({ page }) => {
        const operation = await page.evaluateHandle(createShow);

        await operation.evaluate((operation, args) => operation(...args), ['div']);

        await expect(page.locator('#test1')).toHaveAttribute('style', '');
        await expect(page.locator('#test2')).toHaveAttribute('style', '');
    });

    test.describe('display recovery', () => {
        for (const [name, prepareNode, display] of [
            ['block elements', () => {
                document.getElementById('test1').classList.add('hidden');
            }, 'block'],
            ['inline elements', () => {
                document.body.innerHTML = '<span id="test1" class="hidden">Test</span>';
            }, 'inline'],
            ['table rows', () => {
                document.body.innerHTML = '<table><tbody><tr id="test1" class="hidden"><td>Test</td></tr></tbody></table>';
            }, 'table-row'],
        ]) {
            test(`shows ${name} hidden by a stylesheet`, async ({ page }) => {
                const operation = await page.evaluateHandle(createShow);

                await page.addStyleTag({ content: '.hidden { display: none; }' });
                await page.evaluate(prepareNode);
                await operation.evaluate((operation, args) => operation(...args), ['#test1']);

                await expect(page.locator('#test1')).toHaveCSS('display', display);
            });
        }
    });

    test.describe('display restoration', () => {
        test('preserves a visible inline display value', async ({ page }) => {
            const operation = await page.evaluateHandle(createShow);

            await page.evaluate((operation) => {
                document.getElementById('test1').style.display = 'flex';
                operation('#test1');
            }, operation);

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
        });

        test('restores the inline display after hiding', async ({ page }) => {
            const operation = await page.evaluateHandle(createShow);

            await page.evaluate((operation) => {
                document.getElementById('test1').style.display = 'flex';
                $.hide('#test1');
                operation('#test1');
            }, operation);

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
        });

        test('restores the inline display priority after hiding', async ({ page }) => {
            const operation = await page.evaluateHandle(createShow);

            await page.evaluate((operation) => {
                document.getElementById('test1').style.setProperty('display', 'grid', 'important');
                $.hide('#test1');
                operation('#test1');
            }, operation);

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid !important;');
        });

        test('restores the original display after repeated hides', async ({ page }) => {
            const operation = await page.evaluateHandle(createShow);

            await page.evaluate((operation) => {
                document.getElementById('test1').style.display = 'flex';
                $.hide('#test1');
                $.hide('#test1');
                operation('#test1');
            }, operation);

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
        });
    });

    test.describe('display locks', () => {
        test('releases the display lock after showing', async ({ page }) => {
            const operation = await page.evaluateHandle(createShow);

            await page.evaluate((operation) => {
                $.hide('#test1');
                operation('#test1');
                $.setStyleLock('#test1', 'display', 'grid');
            }, operation);

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid;');
        });

        test('preserves display locks owned by other callers', async ({ page }) => {
            const operation = await page.evaluateHandle(createShow);

            expect(await page.evaluate((operation) => {
                $.setStyleLock('#test1', 'display', 'none');
                operation('#test1');
                try {
                    $.setStyleLock('#test1', 'display', 'grid');
                } catch (error) {
                    return error.message;
                }
            }, operation)).toBe('CSS property "display" is already locked.');
        });
    });
}
