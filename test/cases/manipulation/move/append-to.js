/** @import { Page } from '@playwright/test'; */
/** @import { NodeInput } from '../../../../src/helpers.js'; */

import { expect, test } from '#test';
import { advanceClock } from '../../../setup/browser.js';

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
            '<a href="#" class="test1">Test</a>' +
            '<a href="#" class="test2">Test</a>' +
            '<span></span>' +
            '</div>' +
            '<div id="parent2">' +
            '<a href="#" class="test3">Test</a>' +
            '<a href="#" class="test4">Test</a>' +
            '<span></span>' +
            '</div>';
    });
};

/**
 * Registers shared appendTo behavior tests.
 * @param {((args: [NodeInput, NodeInput]) => void)} appendTo The browser callback for appendTo.
 */
export function appendToTests(appendTo) {
    test('appends each node to each other node', async ({ page }) => {
        await page.evaluate(appendTo, ['a', 'div']);

        const result = await page.evaluate(() => {
            return {
                parent1: document.getElementById('parent1').innerHTML,
                parent2: document.getElementById('parent2').innerHTML,
            };
        });

        expect(result).toEqual({
            parent1: '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
            parent2: '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
        });
    });

    test.describe('placement', () => {
        test('does not clone for the last nodes', async ({ page }) => {
            const nodes = await page.evaluateHandle(() => [...document.querySelectorAll('a')]);

            await page.evaluate(appendTo, ['a', 'div']);

            const isSameNode = await nodes.evaluate((nodes) => {
                return nodes.every((node, index) => node.isSameNode(document.querySelectorAll('a').item(index + 4)));
            });

            expect(isSameNode).toBe(true);
        });
    });

    test.describe('preserved state', () => {
        test.use({ mockClock: true });

        test('preserves events for nodes', async ({ page }) => {
            const calls = await page.evaluateHandle(() => {
                const calls = { count: 0 };

                $.addEvent('a', 'click', () => {
                    calls.count++;
                });

                return calls;
            });

            await page.evaluate(appendTo, ['a', 'div']);

            const clickCount = await calls.evaluate((calls) => {
                $.triggerEvent('a', 'click');
                return calls.count;
            });

            expect(clickCount).toBe(8);
        });

        test('preserves data for nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setData('a', 'test', 'Test');
            });

            await page.evaluate(appendTo, ['a', 'div']);

            const values = await page.evaluate(() => {
                return [...document.querySelectorAll('a')].map((node) => $.getData(node, 'test'));
            });

            expect(values).toEqual([
                'Test',
                'Test',
                'Test',
                'Test',
                'Test',
                'Test',
                'Test',
                'Test',
            ]);
        });

        test('preserves animations for nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.animate(
                    'a',
                    () => {},
                    {
                        duration: 100,
                        debug: true,
                    },
                );
            });

            await page.evaluate(appendTo, ['a', 'div']);
            await advanceClock(page, 25);

            expect(await page.evaluate(() => {
                const nodes = [...document.querySelectorAll('#parent1 > a, #parent2 > a')];

                return nodes.length === 8 &&
                    nodes.every((node) => Boolean(node.dataset.animationProgress));
            })).toBe(true);

            await advanceClock(page, 100);

            expect(await page.evaluate(() =>
                [...document.querySelectorAll('#parent1 > a, #parent2 > a')].every((node) =>
                    !node.dataset.animationProgress &&
                    !node.dataset.animationStart &&
                    !node.dataset.animationTime),
            )).toBe(true);
        });
    });
}
