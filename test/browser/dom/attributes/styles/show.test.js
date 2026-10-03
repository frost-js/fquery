import { setup, showTests } from '#cases/attributes/styles/show.js';
import { expect, test } from '#test';

test.describe('#show', () => {
    test.beforeEach(setup);

    showTests(() => $.show);

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.show(document.getElementById('test1'));
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', '');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.show(document.querySelectorAll('div'));
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', '');
            await expect(page.locator('#test2')).toHaveAttribute('style', '');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.show(document.body.children);
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', '');
            await expect(page.locator('#test2')).toHaveAttribute('style', '');
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.show([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ]);
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', '');
            await expect(page.locator('#test2')).toHaveAttribute('style', '');
        });
    });
});
