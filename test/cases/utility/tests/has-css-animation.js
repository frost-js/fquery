/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.addStyleTag({ content: '.test { animation: spin 4s linear infinite; }' +
        '@keyframes spin { 100% { transform: rotate(360deg); } }' });
    await page.evaluate((_) => {
        document.body.innerHTML =
            '<div id="div1" class="test"></div>' +
            '<div id="div2"></div>' +
            '<div id="div3" class="test"></div>' +
            '<div id="div4"></div>';
    });
};

/**
 * Registers shared hasCSSAnimation behavior tests.
 * @param {((nodes: string) => boolean)} hasCSSAnimation The browser callback for hasCSSAnimation.
 */
export function hasCSSAnimationTests(hasCSSAnimation) {
    test('returns true if any node has a CSS animation', async ({ page }) => {
        expect(await page.evaluate(hasCSSAnimation, 'div')).toBe(true);
    });

    for (const [duration, expected] of [
        ['1s', true],
        ['0s', false],
    ]) {
        test(`returns ${expected} for CSS animation durations of 0s, ${duration}`, async ({ page }) => {
            await page.addStyleTag({ content: '.test { animation: spin 0s linear infinite, spin ' + duration + ' linear infinite; }' });

            expect(await page.evaluate(hasCSSAnimation, 'div')).toBe(expected);
        });
    }

    test('returns false if no nodes have a CSS animation', async ({ page }) => {
        expect(await page.evaluate(hasCSSAnimation, 'div:not(.test)')).toBe(false);
    });
}
