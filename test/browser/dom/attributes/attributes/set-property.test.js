import { setPropertyTests, setup } from '#cases/attributes/attributes/set-property.js';
import { expect, test } from '#test';

test.describe('#setProperty', () => {
    test.beforeEach(setup);

    setPropertyTests((args) => {
        $.setProperty(...args);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate((_) => {
                const element = document.getElementById('test1');
                $.setProperty(element, 'test', 'Test');
            });

            expect(await page.locator('#test1').evaluate((element) => element.test))
                .toBe('Test');
            expect(await page.locator('#test2').evaluate((element) => element.test))
                .toBeUndefined();
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.setProperty(document.querySelectorAll('input'), 'test', 'Test');
            });

            expect(await page.locator('#test1').evaluate((element) => element.test))
                .toBe('Test');
            expect(await page.locator('#test2').evaluate((element) => element.test))
                .toBe('Test');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.setProperty(document.body.children, 'test', 'Test');
            });

            expect(await page.locator('#test1').evaluate((element) => element.test))
                .toBe('Test');
            expect(await page.locator('#test2').evaluate((element) => element.test))
                .toBe('Test');
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate((_) => {
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.setProperty([
                    element1,
                    element2,
                ], 'test', 'Test');
            });

            expect(await page.locator('#test1').evaluate((element) => element.test))
                .toBe('Test');
            expect(await page.locator('#test2').evaluate((element) => element.test))
                .toBe('Test');
        });
    });
});
