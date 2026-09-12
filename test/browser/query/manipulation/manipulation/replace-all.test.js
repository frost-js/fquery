import { replaceAllTests, setup } from '#cases/manipulation/manipulation/replace-all.js';
import { expect, test } from '#test';

test.describe('QuerySet #replaceAll', () => {
    test.beforeEach(setup);

    replaceAllTests(() => (nodes, ...args) => {
        $(nodes).replaceAll(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsSameQuery = await page.evaluate(() => {
            const query = $('a');

            return query === query.replaceAll('div');
        });

        expect(returnsSameQuery).toBe(true);
    });

    test.describe('target inputs', () => {
        test('works with HTMLElement other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('a').replaceAll(document.querySelector('.inner2'));
            });

            await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
            await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
            await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
            await expect(page.locator('.outer2 > a')).toHaveCount(4);
        });

        test('works with NodeList other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('a').replaceAll(document.querySelectorAll('.inner2'));
            });

            await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
            await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
            await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
            await expect(page.locator('.outer2 > a')).toHaveCount(4);
        });

        test('works with HTMLCollection other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('a').replaceAll(document.querySelector('.outer2').children);
            });

            await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
            await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
            await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
            await expect(page.locator('.outer2 > a')).toHaveCount(4);
        });

        test('works with array other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('a').replaceAll([document.querySelector('.inner2')]);
            });

            await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
            await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
            await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
            await expect(page.locator('.outer2 > a')).toHaveCount(4);
        });

        test('works with QuerySet other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('a').replaceAll($('div'));
            });

            await expect(page.locator('body > a')).toHaveCount(8);
            await expect(page.locator('body > div')).toHaveCount(0);
        });
    });

    test.describe('replacement inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<div><span></span></div>');

                $(fragment).replaceAll('a');
            });

            await expect(page.locator('a')).toHaveCount(0);
            await expect(page.locator('.inner1 > div > span')).toHaveCount(2);
            await expect(page.locator('.inner2 > div > span')).toHaveCount(2);
        });
    });
});
