import { detachTests, setup } from '#cases/manipulation/manipulation/detach.js';
import { expect, test } from '#test';

test.describe('#detach', () => {
    test.beforeEach(setup);

    detachTests(() => $.detach);

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.detach(document.getElementById('test1'));
            });

            await expect(page.locator('#test1')).toHaveCount(0);
            await expect(page.locator('#test2')).toHaveCount(1);
            await expect(page.locator('#test3')).toHaveCount(1);
            await expect(page.locator('#test4')).toHaveCount(1);
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.detach(document.querySelectorAll('a'));
            });

            await expect(page.locator('#parent1 > *')).toHaveCount(0);
            await expect(page.locator('#parent2 > *')).toHaveCount(0);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.detach(document.body.children);
            });

            await expect(page.locator('body > *')).toHaveCount(0);
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.detach([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                    document.getElementById('test3'),
                    document.getElementById('test4'),
                ]);
            });

            await expect(page.locator('#parent1 > *')).toHaveCount(0);
            await expect(page.locator('#parent2 > *')).toHaveCount(0);
        });
    });
});
