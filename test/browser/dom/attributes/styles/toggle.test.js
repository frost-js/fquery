import { setup, toggleTests } from '#cases/attributes/styles/toggle.js';
import { expect, test } from '#test';

test.describe('#toggle', () => {
    test.beforeEach(setup);

    toggleTests((args) => {
        $.toggle(...args);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.toggle(document.getElementById('test1'));
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.toggle(document.querySelectorAll('div'));
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
            await expect(page.locator('#test2')).toHaveAttribute('style', '');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.toggle(document.body.children);
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
            await expect(page.locator('#test2')).toHaveAttribute('style', '');
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.toggle([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ]);
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
            await expect(page.locator('#test2')).toHaveAttribute('style', '');
        });
    });
});
