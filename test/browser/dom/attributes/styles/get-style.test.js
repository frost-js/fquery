import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1" style="display: block; width: 100px; height: 100px;"></div><div id="test2"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#getStyle', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns an object with all style values for the first node', async ({ page }) => {
        const style = await page.evaluate((_) => $.getStyle('div'));

        expect(style).toEqual({
            display: 'block',
            width: '100px',
            height: '100px',
        });
    });

    test('returns a style value for the first node', async ({ page }) => {
        await expect.poll(async () =>
            page.evaluate((_) => $.getStyle('div', 'display'))).toBe('block');
    });

    test('returns a custom property', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.setProperty('--theme-color', 'red');
        });

        await expect.poll(async () =>
            page.evaluate((_) => $.getStyle('#test1', '--theme-color'))).toBe('red');
    });

    test('returns an empty string for an undefined style', async ({ page }) => {
        await expect.poll(async () =>
            page.evaluate((_) => $.getStyle('div', 'visibility'))).toBe('');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) => $.getStyle('#invalid', 'display'))).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate((_) =>
            $.getStyle(document.getElementById('test1'), 'display'))).toBe('block');
    });

    test('works with NodeList nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate((_) =>
            $.getStyle(document.querySelectorAll('div'), 'display'))).toBe('block');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate((_) =>
            $.getStyle(document.body.children, 'display'))).toBe('block');
    });

    test('works with array nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate((_) =>
            $.getStyle([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'display'))).toBe('block');
    });
});
