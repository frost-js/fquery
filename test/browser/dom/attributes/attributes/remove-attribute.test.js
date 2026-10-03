import { expect, test } from '#test';

test.describe('#removeAttribute', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML = '<input type="text" id="test1" disabled><input type="number" id="test2" disabled>';
        });
    });

    test('removes an attribute for all nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.removeAttribute('input', 'disabled');
        });

        expect(await page.locator('#test1').getAttribute('disabled')).toBeNull();
        expect(await page.locator('#test2').getAttribute('disabled')).toBeNull();
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.removeAttribute(document.getElementById('test1'), 'disabled');
        });

        expect(await page.locator('#test1').getAttribute('disabled')).toBeNull();
        await expect(page.locator('#test2')).toHaveAttribute('disabled', '');
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.removeAttribute(document.querySelectorAll('input'), 'disabled');
        });

        expect(await page.locator('#test1').getAttribute('disabled')).toBeNull();
        expect(await page.locator('#test2').getAttribute('disabled')).toBeNull();
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.removeAttribute(document.body.children, 'disabled');
        });

        expect(await page.locator('#test1').getAttribute('disabled')).toBeNull();
        expect(await page.locator('#test2').getAttribute('disabled')).toBeNull();
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.removeAttribute([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'disabled');
        });

        expect(await page.locator('#test1').getAttribute('disabled')).toBeNull();
        expect(await page.locator('#test2').getAttribute('disabled')).toBeNull();
    });
});
