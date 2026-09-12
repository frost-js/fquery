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
            '<div id="wrap">' +
            '<div id="parent1">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '<div id="parent2">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '<div class="outer">' +
            '<div class="inner"></div>' +
            '</div>' +
            '</div>';
    });
};

/**
 * Registers shared wrapInner behavior tests.
 * @param {((args: [string, string|Node|NodeList|HTMLCollection|Array<Node>]) => void)} wrapInner The browser callback for wrapInner.
 */
export function wrapInnerTests(wrapInner) {
    test('wraps contents of each node', async ({ page }) => {
        await page.evaluate(wrapInner, ['#wrap > div', '.outer']);
        const html = await page.evaluate(() => document.body.innerHTML);

        expect(html).toBe('<div id="wrap">' +
            '<div id="parent1">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="parent2">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '</div>' +
            '</div>' +
            '</div>');
    });

    test.describe('wrapper inputs', () => {
        test('works with HTMLElement other nodes', async ({ page }) => {
            const wrapper = await page.evaluateHandle(() => document.querySelector('.outer'));
            await page.evaluate(wrapInner, ['#wrap > div', wrapper]);
            const html = await page.evaluate(() => document.body.innerHTML);

            expect(html).toBe('<div id="wrap">' +
                '<div id="parent1">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="parent2">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="wrapper">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '</div>' +
                '</div>' +
                '</div>');
        });

        test('works with NodeList other nodes', async ({ page }) => {
            const wrapper = await page.evaluateHandle(() => document.querySelectorAll('.outer'));
            await page.evaluate(wrapInner, ['#wrap > div', wrapper]);
            const html = await page.evaluate(() => document.body.innerHTML);

            expect(html).toBe('<div id="wrap">' +
                '<div id="parent1">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="parent2">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="wrapper">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '</div>' +
                '</div>' +
                '</div>');
        });

        test('works with HTMLCollection other nodes', async ({ page }) => {
            const wrapper = await page.evaluateHandle(() => document.getElementById('wrapper').children);
            await page.evaluate(wrapInner, ['#wrap > div', wrapper]);
            const html = await page.evaluate(() => document.body.innerHTML);

            expect(html).toBe('<div id="wrap">' +
                '<div id="parent1">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="parent2">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="wrapper">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '</div>' +
                '</div>' +
                '</div>');
        });

        test('works with array other nodes', async ({ page }) => {
            const wrapper = await page.evaluateHandle(() => [document.querySelector('.outer')]);
            await page.evaluate(wrapInner, ['#wrap > div', wrapper]);
            const html = await page.evaluate(() => document.body.innerHTML);

            expect(html).toBe('<div id="wrap">' +
                '<div id="parent1">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="parent2">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="wrapper">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '</div>' +
                '</div>' +
                '</div>');
        });

        test('works with HTML other nodes', async ({ page }) => {
            await page.evaluate(wrapInner, ['#wrap > div', '<div class="div-outer"><span class="span-inner"></span></div>']);
            const html = await page.evaluate(() => document.body.innerHTML);

            expect(html).toBe('<div id="wrap">' +
                '<div id="parent1">' +
                '<div class="div-outer">' +
                '<span class="span-inner">' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div id="parent2">' +
                '<div class="div-outer">' +
                '<span class="span-inner">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="wrapper">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '</div>' +
                '</div>' +
                '</div>');
        });
    });

    test.describe('fragment wrappers', () => {
        test('works with DocumentFragment other nodes', async ({ page }) => {
            const wrapper = await page.evaluateHandle(() => {
                const range = document.createRange();
                const fragment = range.createContextualFragment('<div><span></span></div>');
                return fragment;
            });
            await page.evaluate(wrapInner, ['#wrap > div', wrapper]);
            const html = await page.evaluate(() => document.body.innerHTML);

            expect(html).toBe('<div id="wrap">' +
                '<div id="parent1">' +
                '<div>' +
                '<span>' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div id="parent2">' +
                '<div>' +
                '<span>' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="wrapper">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '</div>' +
                '</div>' +
                '</div>');
        });

        test('works with DocumentFragment other nodes with leading whitespace', async ({ page }) => {
            const wrapper = await page.evaluateHandle(() => {
                const range = document.createRange();
                const fragment = range.createContextualFragment('\n<div><span></span></div>');
                return fragment;
            });
            await page.evaluate(wrapInner, ['#parent1', wrapper]);
            const html = await page.evaluate(() => document.getElementById('parent1').innerHTML);

            expect(html).toBe('\n' +
                '<div>' +
                '<span>' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</span>' +
                '</div>');
        });

        test('works with DocumentFragment other nodes with a leading comment', async ({ page }) => {
            const wrapper = await page.evaluateHandle(() => {
                const range = document.createRange();
                const fragment = range.createContextualFragment('<!-- Test --><div><span></span></div>');
                return fragment;
            });
            await page.evaluate(wrapInner, ['#parent1', wrapper]);
            const html = await page.evaluate(() => document.getElementById('parent1').innerHTML);

            expect(html).toBe('<!-- Test -->' +
                '<div>' +
                '<span>' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</span>' +
                '</div>');
        });

        test('ignores DocumentFragment other nodes without an element', async ({ page }) => {
            const wrapper = await page.evaluateHandle(() => {
                const range = document.createRange();
                const fragment = range.createContextualFragment('Test');
                return fragment;
            });
            await page.evaluate(wrapInner, ['#wrap > div', wrapper]);
            const html = await page.evaluate(() => document.body.innerHTML);

            expect(html).toBe('<div id="wrap">' +
                '<div id="parent1">' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</div>' +
                '<div id="parent2">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>' +
                '</div>' +
                '<div id="wrapper">' +
                '<div class="outer">' +
                '<div class="inner"></div>' +
                '</div>' +
                '</div>');
        });
    });
}
