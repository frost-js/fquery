/** @import { Page } from '@playwright/test'; */
/** @import { setStyle } from '../../../../src/attributes/styles.js'; */

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
 * @param {() => typeof setStyle} createSetStyle Creates the browser-side method adapter.
 */
export function setStyleTests(createSetStyle) {
    test('sets a styles object for all nodes', async ({ page }) => {
        const operation = await page.evaluateHandle(createSetStyle);

        await operation.evaluate((operation, args) => operation(...args), ['div', {
            display: 'block',
            width: '100%',
            height: '100px',
            opacity: 0.5,
        }]);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block; width: 100%; height: 100px; opacity: 0.5;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: block; width: 100%; height: 100px; opacity: 0.5;');
    });

    test('sets a style value for all nodes', async ({ page }) => {
        const operation = await page.evaluateHandle(createSetStyle);

        await operation.evaluate((operation, args) => operation(...args), ['div', 'display', 'block']);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: block;');
    });

    for (const [name, value] of [
        ['number', 100],
        ['numeric string', '100'],
    ]) {
        test(`converts ${name} values to pixels`, async ({ page }) => {
            const operation = await page.evaluateHandle(createSetStyle);

            await operation.evaluate((operation, args) => operation(...args), ['div', 'width', value]);

            await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100px;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'width: 100px;');
        });
    }

    test('converts style object number values to pixels', async ({ page }) => {
        const operation = await page.evaluateHandle(createSetStyle);

        await operation.evaluate((operation, args) => operation(...args), ['div', {
            width: 100,
            height: 100,
        }]);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100px; height: 100px;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'width: 100px; height: 100px;');
    });

    test('preserves string values with units', async ({ page }) => {
        const operation = await page.evaluateHandle(createSetStyle);

        await operation.evaluate((operation, args) => operation(...args), ['div', 'width', '100%']);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100%;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'width: 100%;');
    });

    for (const [name, value] of [
        ['number', 500],
        ['numeric string', '500'],
    ]) {
        test(`does not convert ${name} values for CSS number properties`, async ({ page }) => {
            const operation = await page.evaluateHandle(createSetStyle);

            await operation.evaluate((operation, args) => operation(...args), ['div', 'font-weight', value]);

            await expect(page.locator('#test1')).toHaveAttribute('style', 'font-weight: 500;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'font-weight: 500;');
        });
    }

    test('sets custom properties', async ({ page }) => {
        const operation = await page.evaluateHandle(createSetStyle);

        await page.evaluate((operation) => {
            operation('div', '--brandColor', 'red');
            operation('div', { '--spacing-size': 100 });
        }, operation);

        await expect(page.locator('#test1')).toHaveAttribute('style', '--brandColor: red; --spacing-size: 100;');
        await expect(page.locator('#test2')).toHaveAttribute('style', '--brandColor: red; --spacing-size: 100;');
    });

    test('sets a style object for all nodes with important', async ({ page }) => {
        const operation = await page.evaluateHandle(createSetStyle);

        await operation.evaluate((operation, args) => operation(...args), ['div', {
            display: 'block',
            width: '100%',
        }, null, { important: true }]);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block !important; width: 100% !important;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: block !important; width: 100% !important;');
    });

    test('sets a style value for all nodes with important', async ({ page }) => {
        const operation = await page.evaluateHandle(createSetStyle);

        await operation.evaluate((operation, args) => operation(...args), ['div', 'display', 'block', { important: true }]);

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block !important;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: block !important;');
    });
}
