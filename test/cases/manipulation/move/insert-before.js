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
            '<span></span>' +
            '<a href="#" class="test1">Test</a>' +
            '<a href="#" class="test2">Test</a>' +
            '</div>' +
            '<div id="parent2">' +
            '<span></span>' +
            '<a href="#" class="test3">Test</a>' +
            '<a href="#" class="test4">Test</a>' +
            '</div>';
    });
};

/**
 * Registers shared insertBefore behavior tests.
 * @param {((args: [NodeInput, NodeInput]) => void)} insertBefore The browser callback for insertBefore.
 */
export function insertBeforeTests(insertBefore) {
    test('inserts each node before each other node', async ({ page }) => {
        await page.evaluate(insertBefore, ['a', 'div']);

        const html = await page.evaluate(() => {
            return document.body.innerHTML;
        });

        expect(html).toBe(
            '<a href="#" class="test1">Test</a>' +
            '<a href="#" class="test2">Test</a>' +
            '<a href="#" class="test3">Test</a>' +
            '<a href="#" class="test4">Test</a>' +
            '<div id="parent1"><span></span></div>' +
            '<a href="#" class="test1">Test</a>' +
            '<a href="#" class="test2">Test</a>' +
            '<a href="#" class="test3">Test</a>' +
            '<a href="#" class="test4">Test</a>' +
            '<div id="parent2"><span></span></div>',
        );
    });

    test.describe('placement', () => {
        test('does not clone for the last nodes', async ({ page }) => {
            const nodes = await page.evaluateHandle(() => [...document.querySelectorAll('a')]);

            await page.evaluate(insertBefore, ['a', 'div']);

            const isSameNode = await nodes.evaluate((nodes) => {
                return nodes.every((node, index) =>
                    node.isSameNode(document.querySelectorAll('body > a').item(index + 4)));
            });

            expect(isSameNode).toBe(true);
        });

        test('inserts the original node when the final target is detached', async ({ page }) => {
            const node = await page.evaluateHandle(() => document.getElementById('parent1'));
            const other = await page.evaluateHandle(() => document.querySelector('.test1'));
            const detached = await page.evaluateHandle(() => document.createElement('div'));

            await page.evaluate(insertBefore, [other, [node, detached]]);

            const isSameNode = await other.evaluate((other, node) => other.isSameNode(node.previousSibling), node);

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

            await page.evaluate(insertBefore, ['a', 'div']);

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

            await page.evaluate(insertBefore, ['a', 'div']);

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

            await page.evaluate(insertBefore, ['a', 'div']);
            await advanceClock(page, 25);

            expect(await page.evaluate(() => {
                const nodes = [...document.querySelectorAll('body > a')];

                return nodes.length === 8 &&
                    nodes.every((node) => Boolean(node.dataset.animationProgress));
            })).toBe(true);

            await advanceClock(page, 100);

            expect(await page.evaluate(() =>
                [...document.querySelectorAll('body > a')].every((node) =>
                    !node.dataset.animationProgress &&
                    !node.dataset.animationStart &&
                    !node.dataset.animationTime),
            )).toBe(true);
        });
    });
}
