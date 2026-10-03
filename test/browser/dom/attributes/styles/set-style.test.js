import { setStyleTests, setup } from '#cases/attributes/styles/set-style.js';
import { expect, test } from '#test';

test.describe('#setStyle', () => {
    test.beforeEach(setup);

    setStyleTests(() => $.setStyle);

    test('sets styles on forms with a control whose name is style', async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML = '<form id="form"><input name="style"></form>';
            $.setStyle('form', 'color', 'red');
        });

        await expect(page.locator('#form')).toHaveAttribute('style', 'color: red;');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.setStyle(document.getElementById('test1'), 'display', 'block');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block;');
        expect(await page.locator('#test2').getAttribute('style')).toBeNull();
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.setStyle(document.querySelectorAll('div'), 'display', 'block');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: block;');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.setStyle(document.body.children, 'display', 'block');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: block;');
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.setStyle([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'display', 'block');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: block;');
    });
});
