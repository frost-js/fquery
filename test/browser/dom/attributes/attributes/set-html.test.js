import { setHtmlTests, setup } from '#cases/attributes/attributes/set-html.js';
import { expect, test } from '#test';

test.describe('#setHtml', () => {
    test.beforeEach(setup);

    setHtmlTests(() => $.setHtml);

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setHtml(document.getElementById('test1'), '<span>Test 2</span>');
            });

            await expect(page.locator('#test1 > span')).toHaveText('Test 2');
            await expect(page.locator('#test2 > *')).toHaveCount(0);
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setHtml(document.querySelectorAll('div'), '<span>Test 2</span>');
            });

            await expect(page.locator('#test1 > span')).toHaveText('Test 2');
            await expect(page.locator('#test2 > span')).toHaveText('Test 2');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setHtml(document.body.children, '<span>Test 2</span>');
            });

            await expect(page.locator('#test1 > span')).toHaveText('Test 2');
            await expect(page.locator('#test2 > span')).toHaveText('Test 2');
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setHtml([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ], '<span>Test 2</span>');
            });

            await expect(page.locator('#test1 > span')).toHaveText('Test 2');
            await expect(page.locator('#test2 > span')).toHaveText('Test 2');
        });
    });
});
