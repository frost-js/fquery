import { removeTests, setup } from '#cases/manipulation/manipulation/remove.js';
import { expect, test } from '#test';

test.describe('#remove', () => {
    test.beforeEach(setup);

    removeTests(() => $.remove);

    test.describe('node inputs', () => {
        test('removes meta nodes with a content attribute', async ({ page }) => {
            await page.evaluate(() => {
                document.head.innerHTML = '<meta name="description" content="Test 1">';

                $.remove('meta');
            });

            await expect(page.locator('head > meta')).toHaveCount(0);
        });

        test('removes forms with a control named remove', async ({ page }) => {
            await page.evaluate(() => {
                document.body.innerHTML = '<form><input name="remove"></form>';

                $.remove('form');
            });

            await expect(page.locator('form')).toHaveCount(0);
        });

        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.remove(document.getElementById('inner1'));
            });

            await expect(page.locator('#outer1 > *')).toHaveCount(0);
            await expect(page.locator('#outer2 #test3')).toHaveCount(1);
            await expect(page.locator('#outer2 #test4')).toHaveCount(1);
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.remove(document.querySelectorAll('a'));
            });

            await expect(page.locator('a')).toHaveCount(0);
            await expect(page.locator('#inner1').locator(':scope > *')).toHaveCount(0);
            await expect(page.locator('#inner2').locator(':scope > *')).toHaveCount(0);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.remove(document.body.children);
            });

            await expect(page.locator('body > *')).toHaveCount(0);
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.remove([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                    document.getElementById('test3'),
                    document.getElementById('test4'),
                ]);
            });

            await expect(page.locator('a')).toHaveCount(0);
            await expect(page.locator('#inner1').locator(':scope > *')).toHaveCount(0);
            await expect(page.locator('#inner2').locator(':scope > *')).toHaveCount(0);
        });
    });
});
