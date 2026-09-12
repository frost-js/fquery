import { replaceAllTests, setup } from '#cases/manipulation/manipulation/replace-all.js';
import { expect, test } from '#test';

test.describe('#replaceAll', () => {
    test.beforeEach(setup);

    replaceAllTests(() => $.replaceAll);

    test.describe('target inputs', () => {
        test('works with HTMLElement other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceAll('a', document.querySelector('.inner2'));
            });

            await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
            await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
            await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
            await expect(page.locator('.outer2 > a')).toHaveCount(4);
        });

        test('works with NodeList other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceAll('a', document.querySelectorAll('.inner2'));
            });

            await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
            await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
            await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
            await expect(page.locator('.outer2 > a')).toHaveCount(4);
        });

        test('works with HTMLCollection other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceAll('a', document.querySelector('.outer2').children);
            });

            await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
            await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
            await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
            await expect(page.locator('.outer2 > a')).toHaveCount(4);
        });

        test('works with array other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceAll('a', [document.querySelector('.inner2')]);
            });

            await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
            await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
            await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
            await expect(page.locator('.outer2 > a')).toHaveCount(4);
        });
    });

    test.describe('replacement inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceAll(document.querySelector('.inner1'), 'div');
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceAll(document.querySelector('.outer1').children, 'div');
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceAll(document.querySelectorAll('.inner1'), 'div');
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceAll(document.createRange().createContextualFragment('<div><span></span></div>'), 'a');
            });

            await expect(page.locator('a')).toHaveCount(0);
            await expect(page.locator('.inner1 > div > span')).toHaveCount(2);
            await expect(page.locator('.inner2 > div > span')).toHaveCount(2);
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceAll([document.querySelector('.inner1')], 'div');
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with HTML nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceAll('<div><span class="test">Test</span></div>', 'a');
            });

            await expect(page.locator('a')).toHaveCount(0);
            await expect(page.locator('span.test')).toHaveCount(4);
        });
    });
});
