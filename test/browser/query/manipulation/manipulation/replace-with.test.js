import { replaceWithTests, setup } from '#cases/manipulation/manipulation/replace-with.js';
import { expect, test } from '#test';

test.describe('QuerySet #replaceWith', () => {
    test.beforeEach(setup);

    replaceWithTests(() => (nodes, ...args) => {
        $(nodes).replaceWith(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsSameQuery = await page.evaluate(() => {
            const query = $('div');

            return query === query.replaceWith('a');
        });

        expect(returnsSameQuery).toBe(true);
    });

    test.describe('replacement inputs', () => {
        test('works with HTMLElement other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('div').replaceWith(document.querySelector('.inner1'));
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with NodeList other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('div').replaceWith(document.querySelectorAll('.inner1'));
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with HTMLCollection other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('div').replaceWith(document.querySelector('.outer1').children);
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with DocumentFragment other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('a').replaceWith(document.createRange().createContextualFragment('<div><span></span></div>'));
            });

            await expect(page.locator('a')).toHaveCount(0);
            await expect(page.locator('.inner1 > div > span')).toHaveCount(2);
            await expect(page.locator('.inner2 > div > span')).toHaveCount(2);
        });

        test('works with array other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('div').replaceWith([document.querySelector('.inner1')]);
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with QuerySet other nodes', async ({ page }) => {
            await page.evaluate(() => {
                const query = $('a');

                $('div').replaceWith(query);
            });

            await expect(page.locator('body > a')).toHaveCount(8);
            await expect(page.locator('body > div')).toHaveCount(0);
        });
    });
});
