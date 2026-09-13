/** @import { Page } from '@playwright/test'; */
/** @import { detach } from '../../../../src/manipulation/manipulation.js'; */

import { expect, test } from '#test';
import { advanceClock, setupClock } from '../../../setup/browser.js';

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
 * Registers shared detach behavior tests.
 * @param {() => typeof detach} createDetach Creates the browser-side method adapter.
 */
export function detachTests(createDetach) {
    test('detaches all nodes from the DOM', async ({ page }) => {
        const operation = await page.evaluateHandle(createDetach);

        await operation.evaluate((operation, args) => operation(...args), ['a']);

        await expect(page.locator('#parent1 > *')).toHaveCount(0);
        await expect(page.locator('#parent2 > *')).toHaveCount(0);
    });

    test('returns detached nodes', async ({ page }) => {
        const operation = await page.evaluateHandle(createDetach);

        const nodes = await operation.evaluateHandle((operation, args) => operation(...args), ['a']);
        const ids = await nodes.evaluate((nodes) => nodes.map((node) => node.id));

        expect(ids).toEqual([
            'test1',
            'test2',
            'test3',
            'test4',
        ]);
    });

    test.describe('preserved state', () => {
        test('does not remove events', async ({ page }) => {
            const operation = await page.evaluateHandle(createDetach);

            const clickCount = await page.evaluate((operation) => {
                let count = 0;

                $.addEvent('a', 'click', () => {
                    count++;
                });

                const nodes = operation('a');

                for (const node of nodes) {
                    document.body.appendChild(node);
                }

                $.triggerEvent('a', 'click');

                return count;
            }, operation);

            expect(clickCount).toBe(4);
        });

        test('does not remove data', async ({ page }) => {
            const operation = await page.evaluateHandle(createDetach);

            const values = await page.evaluate((operation) => {
                $.setData('a', 'test', 'Test');

                const nodes = operation('a');

                for (const node of nodes) {
                    document.body.appendChild(node);
                }

                return nodes.map((node) => $.getData(node, 'test'));
            }, operation);

            expect(values).toEqual([
                'Test',
                'Test',
                'Test',
                'Test',
            ]);
        });

        test('does not remove animations', async ({ page }) => {
            const operation = await page.evaluateHandle(createDetach);

            await setupClock(page);

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

            await advanceClock(page, 20);

            expect(await page.evaluate(() =>
                [...document.querySelectorAll('a')].length === 4 &&
                [...document.querySelectorAll('a')].every((node) => Boolean(node.dataset.animationProgress)),
            )).toBe(true);

            await page.evaluate((operation) => {
                const nodes = operation('a');

                for (const node of nodes) {
                    document.body.appendChild(node);
                }
            }, operation);

            expect(await page.evaluate(() =>
                [...document.querySelectorAll('body > a')].length === 4 &&
                [...document.querySelectorAll('body > a')].every((node) => Boolean(node.dataset.animationProgress)),
            )).toBe(true);

            await advanceClock(page, 100);

            expect(await page.evaluate(() =>
                [...document.querySelectorAll('body > a')].every((node) =>
                    !node.dataset.animationProgress &&
                    !node.dataset.animationStart &&
                    !node.dataset.animationTime),
            )).toBe(true);
        });

        test('does not remove queue', async ({ page }) => {
            const operation = await page.evaluateHandle(createDetach);

            await page.evaluate(() => {
                document.documentElement.removeAttribute('data-queue-checkpoint');

                setTimeout(() => {
                    document.documentElement.setAttribute('data-queue-checkpoint', 'done');
                }, 110);

                $.queue('a', (node) => {
                    node.dataset.queueState = 'running';

                    return new Promise((resolve) => {
                        setTimeout(resolve, 100);
                    });
                });
                $.queue('a', (node) => {
                    node.dataset.test = 'Test';
                });
            });

            await expect.poll(async () => await page.locator('#test1').getAttribute('data-queue-state')).toBe('running');

            await page.evaluate((operation) => {
                const nodes = operation('a');

                for (const node of nodes) {
                    document.body.appendChild(node);
                }
            }, operation);

            await expect.poll(async () => await page.locator('html').getAttribute('data-queue-checkpoint')).toBe('done');
            await expect(page.locator('#test1')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('#test2')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('#test3')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('#test4')).toHaveAttribute('data-test', 'Test');
        });
    });
}
