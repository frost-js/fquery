import { hideTests, setup } from '#cases/attributes/styles/hide.js';
import { expect, test } from '#test';

test.describe('#hide', () => {
    test.beforeEach(setup);

    hideTests(() => $.hide);

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.hide(document.getElementById('test1'));
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
            expect(await page.locator('#test2').getAttribute('style')).toBeNull();
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.hide(document.querySelectorAll('div'));
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.hide(document.body.children);
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.hide([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ]);
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
        });
    });
});
