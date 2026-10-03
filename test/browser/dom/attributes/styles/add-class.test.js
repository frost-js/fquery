import { addClassTests, setup } from '#cases/attributes/styles/add-class.js';
import { expect, test } from '#test';

test.describe('#addClass', () => {
    test.beforeEach(setup);

    addClassTests((args) => {
        $.addClass(...args);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.addClass(document.getElementById('test1'), 'test');
        });

        await expect(page.locator('#test1')).toHaveClass('test');
        expect(await page.locator('#test2').getAttribute('class')).toBeNull();
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.addClass(document.querySelectorAll('div'), 'test');
        });

        await expect(page.locator('#test1')).toHaveClass('test');
        await expect(page.locator('#test2')).toHaveClass('test');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.addClass(document.body.children, 'test');
        });

        await expect(page.locator('#test1')).toHaveClass('test');
        await expect(page.locator('#test2')).toHaveClass('test');
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.addClass([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'test');
        });

        await expect(page.locator('#test1')).toHaveClass('test');
        await expect(page.locator('#test2')).toHaveClass('test');
    });
});
