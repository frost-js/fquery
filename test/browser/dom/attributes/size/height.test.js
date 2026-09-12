import { heightTests, setup } from '#cases/attributes/size/height.js';
import { expect, test } from '#test';

test.describe('#height', () => {
    test.beforeEach(setup);

    heightTests((args) => $.height(...args));

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.height(document.getElementById('test1')))).toBe(1050);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.height(document.querySelectorAll('div')))).toBe(1050);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.height(document.body.children))).toBe(1050);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.height(document))).toBe(1152);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.height(window))).toBe(600);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.height([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ]))).toBe(1050);
        });
    });
});
