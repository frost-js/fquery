import { setAttributeTests, setup } from '#cases/attributes/attributes/set-attribute.js';
import { expect, test } from '#test';

test.describe('#setAttribute', () => {
    test.beforeEach(setup);

    setAttributeTests((args) => {
        $.setAttribute(...args);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setAttribute(document.getElementById('test1'), 'placeholder', '123');
        });

        await expect(page.locator('#test1')).toHaveAttribute('placeholder', '123');
        expect(await page.locator('#test2').getAttribute('placeholder')).toBeNull();
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setAttribute(document.querySelectorAll('input'), 'placeholder', '123');
        });

        await expect(page.locator('#test1')).toHaveAttribute('placeholder', '123');
        await expect(page.locator('#test2')).toHaveAttribute('placeholder', '123');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setAttribute(document.body.children, 'placeholder', '123');
        });

        await expect(page.locator('#test1')).toHaveAttribute('placeholder', '123');
        await expect(page.locator('#test2')).toHaveAttribute('placeholder', '123');
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setAttribute([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'placeholder', '123');
        });

        await expect(page.locator('#test1')).toHaveAttribute('placeholder', '123');
        await expect(page.locator('#test2')).toHaveAttribute('placeholder', '123');
    });
});
