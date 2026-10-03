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
        document.body.innerHTML =
            '<div id="parent1" class="test">' +
            '<div id="child1"></div>' +
            '</div>' +
            '<div id="parent2" class="test">' +
            '<div id="child2"></div>' +
            '</div>';
        const child1 = document.getElementById('child1');
        const child2 = document.getElementById('child2');
        const text1 = document.createTextNode('Test 1');
        const text2 = document.createTextNode('Test 2');
        const text3 = document.createTextNode('Test 3');
        const text4 = document.createTextNode('Test 4');
        const text5 = document.createTextNode('Test 5');
        const text6 = document.createTextNode('Test 6');
        const text7 = document.createTextNode('Test 7');
        const text8 = document.createTextNode('Test 8');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');

        child1.appendChild(text1);
        child1.appendChild(text2);
        child1.appendChild(span1);
        child1.appendChild(text3);
        child1.appendChild(text4);

        child2.appendChild(text5);
        child2.appendChild(text6);
        child2.appendChild(span2);
        child2.appendChild(text7);
        child2.appendChild(text8);
    });
};

/**
 * Registers shared normalize behavior tests.
 * @param {((args: [string]) => void)} normalize The browser callback for normalize.
 */
export function normalizeTests(normalize) {
    test('normalizes all text nodes', async ({ page }) => {
        await page.evaluate(normalize, ['.test']);
        const lengths = await page.evaluate(() => [
            document.getElementById('child1').childNodes.length,
            document.getElementById('child2').childNodes.length,
        ]);

        expect(lengths).toEqual([
            3,
            3,
        ]);
    });

    test('retains HTML contents', async ({ page }) => {
        await page.evaluate(normalize, ['.test']);
        const html = await page.evaluate(() => document.body.innerHTML);

        expect(html).toBe('<div id="parent1" class="test">' +
            '<div id="child1">' +
            'Test 1Test 2<span></span>Test 3Test 4' +
            '</div>' +
            '</div>' +
            '<div id="parent2" class="test">' +
            '<div id="child2">' +
            'Test 5Test 6<span></span>Test 7Test 8' +
            '</div>' +
            '</div>');
    });
}
