import { expect, test } from '@playwright/test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1" style="display: block; width: 100px; height: 100px;"></div><div id="test2"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #getStyle', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns an object with all style values for the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div').getStyle())).toEqual({
            display: 'block',
            width: '100px',
            height: '100px',
        });
    });

    test('returns a style value for the first node', async ({ page }) => {
        await expect.poll(async () => page.evaluate((_) =>
            $('div').getStyle('display'))).toBe('block');
    });

    test('returns a custom property', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.setProperty('--theme-color', 'red');
        });

        await expect.poll(async () => page.evaluate((_) =>
            $('#test1').getStyle('--theme-color'))).toBe('red');
    });

    test('returns an empty string for an undefined style', async ({ page }) => {
        await expect.poll(async () => page.evaluate((_) =>
            $('div').getStyle('visibility'))).toBe('');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#invalid').getStyle('display'))).toBe(undefined);
    });
});
