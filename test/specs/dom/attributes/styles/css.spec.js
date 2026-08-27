import { expect, test } from '@playwright/test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1" class="test"></div><div id="test2" class="test"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#css', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: '.test { display: block; width: 50vw; }' });
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns an object with all computed styles for the first node', async ({ page }) => {
        const css = await page.evaluate((_) => {
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

    test('returns a computed style for the first node', async ({ page }) => {
        await expect.poll(async () => page.evaluate((_) => $.css('.test', 'width'))).toBe('400px');
    });

    test('returns a computed custom property', async ({ page }) => {
        await page.addStyleTag({ content: '.test { --theme-color: red; }' });

        await expect.poll(async () => page.evaluate((_) => $.css('.test', '--theme-color'))).toBe('red');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) => $.css('#invalid', 'width'))).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate((_) =>
            $.css(document.getElementById('test1'), 'width'))).toBe('400px');
    });

    test('works with NodeList nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate((_) =>
            $.css(document.querySelectorAll('.test'), 'width'))).toBe('400px');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate((_) =>
            $.css(document.body.children, 'width'))).toBe('400px');
    });

    test('works with array nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate((_) =>
            $.css([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'width'))).toBe('400px');
    });
});
