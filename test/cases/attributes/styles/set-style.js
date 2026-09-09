/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML = '<div id="test1"></div><div id="test2"></div>';
    });
};

/**
 * Registers shared setStyle behavior tests.
 * @param {((args: [string, string|Record<string, string|number>, (string|number|null)?, { important: boolean }?]) => void)} setStyle The browser callback for setStyle.
 */
export function setStyleTests(setStyle) {
    test('sets a styles object for all nodes', async ({ page }) => {
        await page.evaluate(setStyle, ['div', {
            display: 'block',
            width: '100%',
            height: '100px',
            opacity: 0.5,
        }]);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block; width: 100%; height: 100px; opacity: 0.5;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: block; width: 100%; height: 100px; opacity: 0.5;');
    });

    test('sets a style value for all nodes', async ({ page }) => {
        await page.evaluate(setStyle, ['div', 'display', 'block']);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: block;');
    });

    test('converts number values to pixels', async ({ page }) => {
        await page.evaluate(setStyle, ['div', 'width', '100']);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100px;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'width: 100px;');
    });

    test('converts style object number values to pixels', async ({ page }) => {
        await page.evaluate(setStyle, ['div', {
            width: 100,
            height: 100,
        }]);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100px; height: 100px;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'width: 100px; height: 100px;');
    });

    test('does not convert number values with units to pixels', async ({ page }) => {
        await page.evaluate(setStyle, ['div', 'width', '100%']);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100%;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'width: 100%;');
    });

    test('does not convert number values for CSS number properties', async ({ page }) => {
        await page.evaluate(setStyle, ['div', 'font-weight', '500']);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'font-weight: 500;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'font-weight: 500;');
    });

    test('sets a style object for all nodes with important', async ({ page }) => {
        await page.evaluate(setStyle, ['div', {
            display: 'block',
            width: '100%',
        }, null, { important: true }]);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block !important; width: 100% !important;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: block !important; width: 100% !important;');
    });

    test('sets a style value for all nodes with important', async ({ page }) => {
        await page.evaluate(setStyle, ['div', 'display', 'block', { important: true }]);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block !important;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: block !important;');
    });
}
