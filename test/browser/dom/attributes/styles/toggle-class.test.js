import { setup, toggleClassTests } from '#cases/attributes/styles/toggle-class.js';
import { expect, test } from '#test';

test.describe('#toggleClass', () => {
    test.beforeEach(setup);

    toggleClassTests((args) => {
        $.toggleClass(...args);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.toggleClass(document.getElementById('test1'), 'test1');
        });

        await expect(page.locator('#test1')).toHaveClass('test2');
        expect(await page.locator('#test2').getAttribute('class')).toBeNull();
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.toggleClass(document.querySelectorAll('div'), 'test1');
        });

        await expect(page.locator('#test1')).toHaveClass('test2');
        await expect(page.locator('#test2')).toHaveClass('test1');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.toggleClass(document.body.children, 'test1');
        });

        await expect(page.locator('#test1')).toHaveClass('test2');
        await expect(page.locator('#test2')).toHaveClass('test1');
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.toggleClass([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'test1');
        });

        await expect(page.locator('#test1')).toHaveClass('test2');
        await expect(page.locator('#test2')).toHaveClass('test1');
    });
});
