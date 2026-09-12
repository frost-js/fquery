/** @import { Page } from '@playwright/test'; */
/** @import { NodeFilterInput } from '../../../../src/filters.js'; */

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
            '<div id="parent1">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '<div id="parent2">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>';
    });
};

/**
 * Registers shared unwrap behavior tests.
 * @param {((args: [string, NodeFilterInput?]) => void)} unwrap The browser callback for unwrap.
 */
export function unwrapTests(unwrap) {
    const unwrappedHtml = '<a href="#" id="test1">Test</a>' +
        '<a href="#" id="test2">Test</a>' +
        '<a href="#" id="test3">Test</a>' +
        '<a href="#" id="test4">Test</a>';
    const filteredHtml = '<a href="#" id="test1">Test</a>' +
        '<a href="#" id="test2">Test</a>' +
        '<div id="parent2">' +
        '<a href="#" id="test3">Test</a>' +
        '<a href="#" id="test4">Test</a>' +
        '</div>';

    test('unwraps each node', async ({ page }) => {
        await page.evaluate(unwrap, ['a']);
        const html = await page.evaluate(() => document.body.innerHTML);

        expect(html).toBe(unwrappedHtml);
    });

    test.describe('filters', () => {
        for (const [name, createFilter, expected] of [
            ['unwraps each node with filter', () => '#parent1', filteredHtml],
            ['works with function filter', () => (node) => node.id === 'parent1', filteredHtml],
            ['works with HTMLElement filter', () => document.getElementById('parent1'), filteredHtml],
            ['works with NodeList filter', () => document.querySelectorAll('#parent1'), filteredHtml],
            ['works with HTMLCollection filter', () => document.body.children, unwrappedHtml],
            ['works with array filter', () => [document.getElementById('parent1')], filteredHtml],
        ]) {
            test(name, async ({ page }) => {
                const filter = await page.evaluateHandle(createFilter);
                await page.evaluate(unwrap, ['a', filter]);
                const html = await page.evaluate(() => document.body.innerHTML);

                expect(html).toBe(expected);
            });
        }
    });
}
