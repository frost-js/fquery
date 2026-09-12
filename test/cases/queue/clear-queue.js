/** @import { Page } from '@playwright/test'; */
/** @import { clearQueue } from '../../../src/queue/queue.js'; */

import { expect, test } from '#test';
import { advanceClock } from '../../setup/browser.js';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML =
            '<div id="test1"></div>' +
            '<div id="test2" class="queue"></div>' +
            '<div id="test3"></div>' +
            '<div id="test4" class="queue"></div>';
    });
};

/**
 * Registers shared clearQueue behavior tests.
 * @param {() => typeof clearQueue} createClearQueue Creates the browser-side method adapter.
 */
export function clearQueueTests(createClearQueue) {
    test.describe('clearing', () => {
        test('clears the queue for each node', async ({ page }) => {
            const operation = await page.evaluateHandle(createClearQueue);

            await page.evaluate((operation) => {
                $.queue('.queue', (node) => {
                    node.dataset.test = 'Test';
                });
                operation('.queue');
            }, operation);

            await advanceClock(page, 200);

            expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
        });

        test('clears future queued items', async ({ page }) => {
            const operation = await page.evaluateHandle(createClearQueue);

            await page.evaluate(() => {
                window.queueResolvers = [];

                $.queue('.queue', () =>
                    new Promise((resolve) => {
                        window.queueResolvers.push(resolve);
                    }),
                );
                $.queue('.queue', (node) => {
                    node.dataset.test = 'Test';
                });
            });

            await advanceClock(page, 1);

            expect(await page.evaluate(() => window.queueResolvers.length)).toBe(2);

            await page.evaluate((operation) => {
                operation('.queue');

                window.queueResolvers.splice(0).forEach((resolve) => {
                    resolve();
                });
            }, operation);

            await advanceClock(page, 200);

            expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();
        });
    });

    test.describe('named queues', () => {
        test('clears named queue', async ({ page }) => {
            const operation = await page.evaluateHandle(createClearQueue);

            await page.evaluate(() => {
                window.defaultQueueResolvers = [];
                window.namedQueueResolvers = [];

                $.queue('.queue', () =>
                    new Promise((resolve) => {
                        window.defaultQueueResolvers.push(resolve);
                    }),
                );
                $.queue('.queue', () =>
                    new Promise((resolve) => {
                        window.namedQueueResolvers.push(resolve);
                    }),
                { queueName: 'test' });
                $.queue('.queue', (node) => {
                    node.dataset.test1 = 'Test';
                });
                $.queue('.queue', (node) => {
                    node.dataset.test2 = 'Test';
                }, { queueName: 'test' });
            });

            await advanceClock(page, 1);

            await expect.poll(async () => await page.evaluate(() => ({
                default: window.defaultQueueResolvers.length,
                named: window.namedQueueResolvers.length,
            }))).toEqual({
                default: 2,
                named: 2,
            });

            await page.evaluate((operation) => {
                operation('.queue', { queueName: 'test' });

                window.defaultQueueResolvers.splice(0).forEach((resolve) => {
                    resolve();
                });
                window.namedQueueResolvers.splice(0).forEach((resolve) => {
                    resolve();
                });
            }, operation);

            await advanceClock(page, 200);

            await expect(page.locator('#test2')).toHaveAttribute('data-test1', 'Test');
            await expect(page.locator('#test4')).toHaveAttribute('data-test1', 'Test');
            expect(await page.locator('#test2').getAttribute('data-test2')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test2')).toBeNull();
        });

        test('clears all queues', async ({ page }) => {
            const operation = await page.evaluateHandle(createClearQueue);

            await page.evaluate(() => {
                window.defaultQueueResolvers = [];
                window.namedQueueResolvers = [];

                $.queue('.queue', () =>
                    new Promise((resolve) => {
                        window.defaultQueueResolvers.push(resolve);
                    }),
                );
                $.queue('.queue', () =>
                    new Promise((resolve) => {
                        window.namedQueueResolvers.push(resolve);
                    }),
                { queueName: 'test' });
                $.queue('.queue', (node) => {
                    node.dataset.test1 = 'Test';
                });
                $.queue('.queue', (node) => {
                    node.dataset.test2 = 'Test';
                }, { queueName: 'test' });
            });

            await advanceClock(page, 1);

            await expect.poll(async () => await page.evaluate(() => ({
                default: window.defaultQueueResolvers.length,
                named: window.namedQueueResolvers.length,
            }))).toEqual({
                default: 2,
                named: 2,
            });

            await page.evaluate((operation) => {
                operation('.queue', { queueName: null });

                window.defaultQueueResolvers.splice(0).forEach((resolve) => {
                    resolve();
                });
                window.namedQueueResolvers.splice(0).forEach((resolve) => {
                    resolve();
                });
            }, operation);

            await advanceClock(page, 200);

            expect(await page.locator('#test2').getAttribute('data-test1')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test1')).toBeNull();
            expect(await page.locator('#test2').getAttribute('data-test2')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test2')).toBeNull();
        });
    });
}
