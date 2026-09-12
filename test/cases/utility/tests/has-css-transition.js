/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.addStyleTag({ content: '.test { transition: opacity 1s; }' });
    await page.evaluate((_) => {
        document.body.innerHTML =
            '<div id="div1" class="test"></div>' +
            '<div id="div2></div>' +
            '<div id="div3" class="test"></div>' +
            '<div id="div4"></div>';
    });
};

/**
 * Registers shared hasCssTransition behavior tests.
 * @param {((nodes: string) => boolean)} hasCssTransition The browser callback for hasCssTransition.
 */
export function hasCssTransitionTests(hasCssTransition) {
    test('returns true if any node has a CSS transition', async ({ page }) => {
        expect(await page.evaluate(hasCssTransition, 'div')).toBe(true);
    });

    for (const [duration, expected] of [
        ['1s', true],
        ['0s', false],
    ]) {
        test(`returns ${expected} for CSS transition durations of 0s, ${duration}`, async ({ page }) => {
            await page.addStyleTag({ content: '.test { transition: opacity 0s, transform ' + duration + '; }' });

            expect(await page.evaluate(hasCssTransition, 'div')).toBe(expected);
        });
    }

    test('returns false if no nodes have a CSS transition', async ({ page }) => {
        expect(await page.evaluate(hasCssTransition, 'div:not(.test)')).toBe(false);
    });
}
