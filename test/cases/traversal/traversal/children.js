/** @import { Page } from '@playwright/test'; */
/** @import { children } from '../../../../src/traversal/traversal.js'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML = '<div id="parent1" class="parent"><div id="child1"><span></span></div><div id="child2"><span></span></div><span id="child3"><span></span></span><span id="child4"><span></span></span></div><div id="parent2" class="parent"><div id="child5"><span></span></div><div id="child6"><span></span></div><span id="child7"><span></span></span><span id="child8"><span></span></span></div>';
    });
};

/**
 * Registers shared children behavior tests.
 * @param {() => typeof children} createChildren Creates the browser-side method adapter.
 */
export function childrenTests(createChildren) {
    test('returns all children of each node', async ({ page }) => {
        const operation = await page.evaluateHandle(createChildren);

        const ids = await operation.evaluate((operation, args) => operation(...args).map((node) => node.id), ['.parent']);

        expect(ids).toEqual([
            'child1',
            'child2',
            'child3',
            'child4',
            'child5',
            'child6',
            'child7',
            'child8',
        ]);
    });

    test('returns all children of each node matching a filter', async ({ page }) => {
        const operation = await page.evaluateHandle(createChildren);

        const ids = await operation.evaluate((operation, args) => operation(...args).map((node) => node.id), ['.parent', 'span']);

        expect(ids).toEqual([
            'child3',
            'child4',
            'child7',
            'child8',
        ]);
    });

    test.describe('shadowed properties', () => {
        test('returns form children when a control shadows children', async ({ page }) => {
            const operation = await page.evaluateHandle(createChildren);

            const ids = await page.evaluate((operation) => {
                document.body.innerHTML =
                    '<form><input id="test1" name="children"><input id="test2"></form>';
                const nodes = operation('form');
                return nodes.map((node) => node.id);
            }, operation);

            expect(ids).toEqual([
                'test1',
                'test2',
            ]);
        });

        test('returns form child nodes when a control shadows childNodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createChildren);

            const ids = await page.evaluate((operation) => {
                document.body.innerHTML =
                    '<form><input id="test1"><input id="test2" name="childNodes"></form>';
                const nodes = operation('form', null, { elementsOnly: false });
                return nodes.map((node) => node.id);
            }, operation);

            expect(ids).toEqual([
                'test1',
                'test2',
            ]);
        });
    });

    test.describe('filter inputs', () => {
        for (const [name, createArgs, expected] of [
            ['function', () => ['.parent', (node) => node.tagName === 'SPAN'], ['child3', 'child4', 'child7', 'child8']],
            ['HTMLElement', () => ['.parent', document.getElementById('child3')], ['child3']],
            ['NodeList', () => ['.parent', document.querySelectorAll('span')], ['child3', 'child4', 'child7', 'child8']],
            ['HTMLCollection', () => ['.parent', document.getElementById('parent1').children], ['child1', 'child2', 'child3', 'child4']],
            ['array', () => ['.parent', [document.getElementById('child3'), document.getElementById('child4'), document.getElementById('child7'), document.getElementById('child8')]], ['child3', 'child4', 'child7', 'child8']],
        ]) {
            test(`works with ${name} filter`, async ({ page }) => {
                const operation = await page.evaluateHandle(createChildren);

                const args = await page.evaluateHandle(createArgs);
                const ids = await operation.evaluate((operation, args) => operation(...args).map((node) => node.id), args);

                expect(ids).toEqual(expected);
            });
        }
    });
}
