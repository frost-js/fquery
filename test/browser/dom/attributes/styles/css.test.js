import { cssTests, setup } from '#cases/attributes/styles/css.js';
import { expect, test } from '#test';

test.describe('#css', () => {
    test.beforeEach(setup);

    cssTests((args) => $.css(...args));

    test('returns an object with all computed styles for the first node', async ({ page }) => {
        const css = await page.evaluate(() => {
            const style = $.css('.test');
            return {
                display: style.display,
                width: style.width,
            };
        });

        expect(css).toEqual({
            display: 'block',
            width: '400px',
        });
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate(() =>
            $.css(document.getElementById('test1'), 'width'))).toBe('400px');
    });

    test('works with NodeList nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate(() =>
            $.css(document.querySelectorAll('.test'), 'width'))).toBe('400px');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate(() =>
            $.css(document.body.children, 'width'))).toBe('400px');
    });

    test('works with array nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate(() =>
            $.css([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'width'))).toBe('400px');
    });
});
