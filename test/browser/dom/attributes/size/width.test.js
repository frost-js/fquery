import { setup, widthTests } from '#cases/attributes/size/width.js';
import { expect, test } from '#test';

test.describe('#width', () => {
    test.beforeEach(setup);

    widthTests((args) => $.width(...args));

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.width(document.getElementById('test1')))).toBe(1250);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.width(document.querySelectorAll('div')))).toBe(1250);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.width(document.body.children))).toBe(1250);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.width(document))).toBe(800);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.width(window))).toBe(800);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.width([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ]))).toBe(1250);
        });
    });
});
