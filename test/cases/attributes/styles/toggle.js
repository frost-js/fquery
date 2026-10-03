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
        document.body.innerHTML = '<div id="test1"></div><div id="test2" style="display: none;"></div>';
    });
};

/**
 * Registers shared toggle behavior tests.
 * @param {((args: [NodeInput, boolean?]) => void)} toggle The browser callback for toggle.
 */
export function toggleTests(toggle) {
    test('toggles the visibility of all nodes', async ({ page }) => {
        await page.evaluate(toggle, ['div']);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', '');
    });

    test('shows all nodes when forced', async ({ page }) => {
        await page.evaluate(toggle, ['div', true]);

        await expect(page.locator('#test1')).toHaveCSS('display', 'block');
        await expect(page.locator('#test2')).toHaveCSS('display', 'block');
    });

    test('hides all nodes when forced', async ({ page }) => {
        await page.evaluate(toggle, ['div', false]);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
    });

    test.describe('display recovery', () => {
        test('shows elements hidden by a stylesheet', async ({ page }) => {
            await page.addStyleTag({ content: '.hidden { display: none; }' });
            await page.evaluate(() => {
                document.getElementById('test1').classList.add('hidden');
            });

            await page.evaluate(toggle, ['#test1']);

            await expect(page.locator('#test1')).toHaveCSS('display', 'block');
        });

        test('shows detached elements hidden by an inline style', async ({ page }) => {
            const node = await page.evaluateHandle(() => {
                const node = document.getElementById('test2');
                node.remove();
                return node;
            });

            await page.evaluate(toggle, [node]);

            expect(await node.evaluate((node) => node.style.display)).toBe('');
        });
    });

    test.describe('display restoration', () => {
        test('hides stylesheet-hidden elements after showing them', async ({ page }) => {
            await page.addStyleTag({ content: '.hidden { display: none; }' });
            await page.evaluate(() => {
                document.getElementById('test1').classList.add('hidden');
            });

            await page.evaluate(toggle, ['#test1']);
            await page.evaluate(toggle, ['#test1']);

            await expect(page.locator('#test1')).toHaveCSS('display', 'none');
        });

        test('restores the inline display after toggling twice', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('test1').style.display = 'flex';
            });

            await page.evaluate(toggle, ['#test1']);
            await page.evaluate(toggle, ['#test1']);

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
        });
    });
}
