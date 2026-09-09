/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate((_) => {
        document.body.innerHTML =
            '<div id="parent" style="position: relative; margin: 1050px; padding: 25px 50px;">' +
            '<div id="test1" data-toggle="child" style="display: block; width: 100px; height: 100px; padding: 50px;"></div>' +
            '<div id="test2" data-toggle="child"></div>';
        window.scrollTo(1000, 1000);
    });
};

/**
 * Registers shared position behavior tests.
 * @param {((args: [string, { offset: boolean }?]) => ({ x: number, y: number }|undefined))} position The browser callback for position.
 */
export function positionTests(position) {
    test('returns the position of the first node', async ({ page }) => {
        expect(await page.evaluate(position, ['[data-toggle="child"]'])).toEqual({
            x: 50,
            y: 25,
        });
    });

    test('returns the position of the first node with offset', async ({ page }) => {
        expect(await page.evaluate(position, ['[data-toggle="child"]', { offset: true }])).toEqual({
            x: 1108,
            y: 1075,
        });
    });

    test('returns the position with offset including parent borders', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('parent').style.cssText += 'border: 10px solid; border-left-width: 20px;';
        });

        expect(await page.evaluate(position, ['[data-toggle="child"]', { offset: true }])).toEqual({
            x: 1128,
            y: 1085,
        });
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate(position, ['#invalid'])).toBe(undefined);
    });
}
