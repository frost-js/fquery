import { setTextTests, setup } from '#cases/attributes/attributes/set-text.js';
import { expect, test } from '#test';

test.describe('#setText', () => {
    test.beforeEach(setup);

    setTextTests(() => $.setText);

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setText(document.getElementById('test1'), 'Test 2');
            });

            await expect(page.locator('#test1')).toHaveText('Test 2');
            await expect(page.locator('#test2')).toHaveText('');
            await expect(page.locator('#test1 > *')).toHaveCount(0);
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setText(document.querySelectorAll('div'), 'Test 2');
            });

            await expect(page.locator('#test1')).toHaveText('Test 2');
            await expect(page.locator('#test2')).toHaveText('Test 2');
            await expect(page.locator('#test1 > *')).toHaveCount(0);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setText(document.body.children, 'Test 2');
            });

            await expect(page.locator('#test1')).toHaveText('Test 2');
            await expect(page.locator('#test2')).toHaveText('Test 2');
            await expect(page.locator('#test1 > *')).toHaveCount(0);
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setText([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ], 'Test 2');
            });

            await expect(page.locator('#test1')).toHaveText('Test 2');
            await expect(page.locator('#test2')).toHaveText('Test 2');
            await expect(page.locator('#test1 > *')).toHaveCount(0);
        });
    });
});
