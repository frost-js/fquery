/** @import { Page } from '@playwright/test'; */
/** @import { hide } from '../../../../src/attributes/styles.js'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML = '<div id="test1"></div><div id="test2"></div>';
    });
};

/**
 * Registers shared hide behavior tests.
 * @param {() => typeof hide} createHide Creates the browser-side method adapter.
 */
export function hideTests(createHide) {
    test('hides all nodes', async ({ page }) => {
        const operation = await page.evaluateHandle(createHide);

        await operation.evaluate((operation, args) => operation(...args), ['div']);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
    });

    test.describe('display priority', () => {
        test('preserves the inline display priority', async ({ page }) => {
            const operation = await page.evaluateHandle(createHide);

            await page.addStyleTag({ content: '#test1 { display: flex !important; }' });
            await page.evaluate((operation) => {
                document.getElementById('test1').style.setProperty('display', 'grid', 'important');
                operation('#test1');
            }, operation);

            await expect(page.locator('#test1')).toHaveCSS('display', 'none');
        });
    });

    test.describe('repeated hides', () => {
        test('preserves the inline display priority after repeated hides', async ({ page }) => {
            const operation = await page.evaluateHandle(createHide);

            await page.addStyleTag({ content: '#test1 { display: flex !important; }' });
            await page.evaluate((operation) => {
                document.getElementById('test1').style.setProperty('display', 'grid', 'important');
                operation('#test1');
                operation('#test1');
            }, operation);

            await expect(page.locator('#test1')).toHaveCSS('display', 'none');
        });

        test('hides again after an ordinary style write', async ({ page }) => {
            const operation = await page.evaluateHandle(createHide);

            await page.evaluate((operation) => {
                operation('#test1');
                document.getElementById('test1').style.display = 'flex';
                operation('#test1');
            }, operation);

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        });
    });

    test.describe('display locks', () => {
        test('does not hide earlier nodes when a later display is locked', async ({ page }) => {
            const operation = await page.evaluateHandle(createHide);

            expect(await page.evaluate((operation) => {
                $.setStyleLock('#test2', 'display', 'grid');
                try {
                    operation('div');
                } catch (error) {
                    return error.message;
                }
            }, operation)).toBe('CSS property "display" is already locked.');

            expect(await page.locator('#test1').getAttribute('style')).toBeNull();
            await expect(page.locator('#test2')).toHaveAttribute('style', 'display: grid;');
        });
    });
}
