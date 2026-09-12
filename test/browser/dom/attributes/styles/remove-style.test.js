import { removeStyleTests, setup } from '#cases/attributes/styles/remove-style.js';
import { expect, test } from '#test';

test.describe('#removeStyle', () => {
    test.beforeEach(setup);

    removeStyleTests((args) => {
        $.removeStyle(...args);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.removeStyle(document.getElementById('test1'), 'color');
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'background-color: blue;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'background-color: blue; color: white;');
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.removeStyle(document.querySelectorAll('div'), 'color');
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'background-color: blue;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'background-color: blue;');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.removeStyle(document.body.children, 'color');
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'background-color: blue;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'background-color: blue;');
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.removeStyle([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ], 'color');
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'background-color: blue;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'background-color: blue;');
        });
    });
});
