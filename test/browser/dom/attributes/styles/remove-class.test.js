import { removeClassTests, setup } from '#cases/attributes/styles/remove-class.js';
import { expect, test } from '#test';

test.describe('#removeClass', () => {
    test.beforeEach(setup);

    removeClassTests((args) => {
        $.removeClass(...args);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.removeClass(document.getElementById('test1'), 'test1');
        });

        await expect(page.locator('#test1')).toHaveClass('test2');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.removeClass(document.querySelectorAll('div'), 'test1');
        });

        await expect(page.locator('#test1')).toHaveClass('test2');
        await expect(page.locator('#test2')).toHaveClass('test2');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.removeClass(document.body.children, 'test1');
        });

        await expect(page.locator('#test1')).toHaveClass('test2');
        await expect(page.locator('#test2')).toHaveClass('test2');
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.removeClass([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'test1');
        });

        await expect(page.locator('#test1')).toHaveClass('test2');
        await expect(page.locator('#test2')).toHaveClass('test2');
    });
});
