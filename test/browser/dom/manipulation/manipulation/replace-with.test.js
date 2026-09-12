import { replaceWithTests, setup } from '#cases/manipulation/manipulation/replace-with.js';
import { expect, test } from '#test';

test.describe('#replaceWith', () => {
    test.beforeEach(setup);

    replaceWithTests(() => $.replaceWith);

    test.describe('target inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceWith(document.querySelector('.inner2'), 'a');
            });

            await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
            await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
            await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
            await expect(page.locator('.outer2 > a')).toHaveCount(4);
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceWith(document.querySelectorAll('.inner2'), 'a');
            });

            await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
            await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
            await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
            await expect(page.locator('.outer2 > a')).toHaveCount(4);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceWith(document.querySelector('.outer2').children, 'a');
            });

            await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
            await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
            await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
            await expect(page.locator('.outer2 > a')).toHaveCount(4);
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceWith([document.querySelector('.inner2')], 'a');
            });

            await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
            await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
            await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
            await expect(page.locator('.outer2 > a')).toHaveCount(4);
        });
    });

    test.describe('replacement inputs', () => {
        test('works with HTMLElement other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceWith('div', document.querySelector('.inner1'));
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with NodeList other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceWith('div', document.querySelectorAll('.inner1'));
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with HTMLCollection other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceWith('div', document.querySelector('.outer1').children);
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with array other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.replaceWith('div', [document.querySelector('.inner1')]);
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with DocumentFragment other nodes', async ({ page }) => {
            await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<div><span></span></div>');

                $.replaceWith('a', fragment);
            });

            await expect(page.locator('a')).toHaveCount(0);
            await expect(page.locator('.inner1 > div > span')).toHaveCount(2);
            await expect(page.locator('.inner2 > div > span')).toHaveCount(2);
        });
    });
});
