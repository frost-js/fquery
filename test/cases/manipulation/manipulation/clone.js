/** @import { Page } from '@playwright/test'; */
/** @import { CloneOptions } from '../../../../src/manipulation/manipulation.js'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML =
            '<div class="parent1">' +
            '<a href="#" class="test1">Test</a>' +
            '<a href="#" class="test2">Test</a>' +
            '</div>' +
            '<div class="parent2">' +
            '<a href="#" class="test3">Test</a>' +
            '<a href="#" class="test4">Test</a>' +
            '</div>';
    });
};

/**
 * Registers shared clone behavior tests.
 * @param {((args: [string, CloneOptions?]) => Array<Node>)} clone The browser callback for clone.
 */
export function cloneTests(clone) {
    test('clones all nodes', async ({ page }) => {
        const clones = await page.evaluateHandle(clone, ['div']);

        await clones.evaluate((clones) => {
            for (const clone of clones) {
                document.body.appendChild(clone);
            }
        });

        await expect(page.locator('body > div')).toHaveCount(4);
        await expect(page.locator('body > div').nth(2)).toHaveClass('parent1');
        await expect(page.locator('body > div').nth(3)).toHaveClass('parent2');
        await expect(page.locator('body > div').nth(2).locator('a')).toHaveCount(2);
        await expect(page.locator('body > div').nth(3).locator('a')).toHaveCount(2);
    });

    test('shallow clones all nodes', async ({ page }) => {
        const clones = await page.evaluateHandle(clone, ['div', { deep: false }]);

        await clones.evaluate((clones) => {
            for (const clone of clones) {
                document.body.appendChild(clone);
            }
        });

        await expect(page.locator('body > div')).toHaveCount(4);
        await expect(page.locator('body > div').nth(0).locator('a')).toHaveCount(2);
        await expect(page.locator('body > div').nth(1).locator('a')).toHaveCount(2);
        await expect(page.locator('body > div').nth(2).locator('a')).toHaveCount(0);
        await expect(page.locator('body > div').nth(3).locator('a')).toHaveCount(0);
    });
}
