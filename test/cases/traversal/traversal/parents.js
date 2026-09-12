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
 * Registers shared parents behavior tests.
 * @param {((args: [string, (NodeFilterInput|null)?, NodeFilterInput?]) => Array<string>)} parents The browser callback for parents.
 */
export function parentsTests(parents) {
    test('returns the parents of each node', async ({ page }) => {
        const ids = await page.evaluate(parents, ['a']);

        expect(ids).toEqual([
            'html',
            'body',
            'parent1',
            'child1',
            'span1',
            'parent2',
            'child2',
            'span2',
        ]);
    });

    test('returns the parents of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate(parents, ['a', 'div']);

        expect(ids).toEqual([
            'parent1',
            'child1',
            'parent2',
            'child2',
        ]);
    });

    test('returns the parents of each node before a limit', async ({ page }) => {
        const ids = await page.evaluate(parents, ['a', null, 'div']);

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test.describe('filter inputs', () => {
        for (const [name, createArgs, expected] of [
            ['function', () => ['a', (node) => node.tagName === 'DIV'], ['parent1', 'child1', 'parent2', 'child2']],
            ['HTMLElement', () => ['a', document.getElementById('child1')], ['child1']],
            ['NodeList', () => ['a', document.querySelectorAll('div')], ['parent1', 'child1', 'parent2', 'child2']],
            ['HTMLCollection', () => ['a', document.body.children], ['parent1', 'parent2']],
            ['array', () => ['a', [document.getElementById('parent1'), document.getElementById('child1'), document.getElementById('parent2'), document.getElementById('child2')]], ['parent1', 'child1', 'parent2', 'child2']],
        ]) {
            test(`works with ${name} filter`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);
                const ids = await page.evaluate(parents, args);

                expect(ids).toEqual(expected);
            });
        }
    });

    test.describe('limit inputs', () => {
        for (const [name, createArgs, expected] of [
            ['function', () => ['a', null, (node) => node.id === 'body'], ['parent1', 'child1', 'span1', 'parent2', 'child2', 'span2']],
            ['HTMLElement', () => ['a', null, document.body], ['parent1', 'child1', 'span1', 'parent2', 'child2', 'span2']],
            ['NodeList', () => ['a', null, document.querySelectorAll('div')], ['span1', 'span2']],
            ['HTMLCollection', () => ['a', null, document.body.children], ['child1', 'span1', 'child2', 'span2']],
            ['array', () => ['a', null, [document.getElementById('parent1'), document.getElementById('parent2')]], ['child1', 'span1', 'child2', 'span2']],
        ]) {
            test(`works with ${name} limit`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);
                const ids = await page.evaluate(parents, args);

                expect(ids).toEqual(expected);
            });
        }
    });
}
