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
        document.body.innerHTML = '<div id="parent1"><div id="child1"><span id="span1"><a id="a1"></a></span></div></div><div id="parent2"><div id="child2"><span id="span2"><a id="a2"></a></span></div></div>';
    });
};

/**
 * Registers shared closest behavior tests.
 * @param {((args: [string, (NodeFilterInput|null)?, NodeFilterInput?]) => Array<string>)} closest The browser callback for closest.
 */
export function closestTests(closest) {
    test('returns the closest ancestor of each node', async ({ page }) => {
        const ids = await page.evaluate(closest, ['a']);

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('returns the closest ancestor of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate(closest, ['a', 'div']);

        expect(ids).toEqual([
            'child1',
            'child2',
        ]);
    });

    test('returns the closest ancestor of each node before a limit', async ({ page }) => {
        const ids = await page.evaluate(closest, ['a', 'div', '#span2']);

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test.describe('filter inputs', () => {
        for (const [name, createArgs, expected] of [
            ['function', () => ['a', (node) => node.tagName === 'DIV'], ['child1', 'child2']],
            ['HTMLElement', () => ['a', document.getElementById('child1')], ['child1']],
            ['NodeList', () => ['a', document.querySelectorAll('div')], ['child1', 'child2']],
            ['HTMLCollection', () => ['a', document.body.children], ['parent1', 'parent2']],
            ['array', () => ['a', [document.getElementById('child1'), document.getElementById('child2')]], ['child1', 'child2']],
        ]) {
            test(`works with ${name} filter`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);
                const ids = await page.evaluate(closest, args);

                expect(ids).toEqual(expected);
            });
        }
    });

    test.describe('limit inputs', () => {
        for (const [name, createArgs, expected] of [
            ['function', () => ['a', 'div', (node) => node.id === 'span2'], ['child1']],
            ['HTMLElement', () => ['a', 'div', document.getElementById('span2')], ['child1']],
            ['NodeList', () => ['a', 'div', document.querySelectorAll('#span2')], ['child1']],
            ['HTMLCollection', () => ['a', 'div', document.getElementById('child2').children], ['child1']],
            ['array', () => ['a', 'div', [document.getElementById('span2')]], ['child1']],
        ]) {
            test(`works with ${name} limit`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);
                const ids = await page.evaluate(closest, args);

                expect(ids).toEqual(expected);
            });
        }
    });
}
