/** @import { Page } from '@playwright/test'; */
/** @import { queue } from '../../../src/queue/queue.js'; */

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
 * Registers shared queue behavior tests.
 * @param {() => typeof queue} createQueue Creates the browser-side method adapter.
 */
export function queueTests(createQueue) {
    test.describe('execution', () => {
        test('queues a callback for each node', async ({ page }) => {
            const operation = await page.evaluateHandle(createQueue);

            await page.evaluate((operation) => {
                operation('.queue', (node) => {
                    node.dataset.test = 'Test';
                });
            }, operation);

            await advanceClock(page, 1);

            await expect(page.locator('#test2')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('#test4')).toHaveAttribute('data-test', 'Test');
            expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
        });

        test('does not execute the callback immediately', async ({ page }) => {
            const operation = await page.evaluateHandle(createQueue);

            const values = await page.evaluate((operation) => {
                operation('.queue', (node) => {
                    node.dataset.test = 'Test';
                });

                return [...document.body.children].map((node) => node.getAttribute('data-test'));
            }, operation);

            expect(values).toEqual([
                null,
                null,
                null,
                null,
            ]);
        });

        test('only executes callbacks after the previous item is resolved', async ({ page }) => {
            const operation = await page.evaluateHandle(createQueue);

            await page.evaluate((operation) => {
                window.queueResolvers = [];

                operation('.queue', () =>
                    new Promise((resolve) => {
                        window.queueResolvers.push(resolve);
                    }),
                );
                operation('.queue', (node) => {
                    node.dataset.test = 'Test';
                });
            }, operation);

            await advanceClock(page, 1);

            expect(await page.evaluate(() => window.queueResolvers.length)).toBe(2);

            expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();

            await page.evaluate(() => {
                window.queueResolvers.splice(0).forEach((resolve) => {
                    resolve();
                });
            });

            await advanceClock(page, 1);

            await expect(page.locator('#test2')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('#test4')).toHaveAttribute('data-test', 'Test');
        });

        test('does not continue the queue if an item is rejected', async ({ page }) => {
            const operation = await page.evaluateHandle(createQueue);

            await page.evaluate((operation) => {
                window.queueRejectors = [];

                operation('.queue', () =>
                    new Promise((_, reject) => {
                        window.queueRejectors.push(reject);
                    }),
                );
                operation('.queue', (node) => {
                    node.dataset.test = 'Test';
                });
            }, operation);

            await advanceClock(page, 1);

            expect(await page.evaluate(() => window.queueRejectors.length)).toBe(2);

            expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();

            await page.evaluate(() => {
                window.queueRejectors.splice(0).forEach((reject) => {
                    reject();
                });
            });

            await advanceClock(page, 200);

            expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();
        });
    });

    test.describe('named queues', () => {
        test('processes multiple queues simultaneously', async ({ page }) => {
            const operation = await page.evaluateHandle(createQueue);

            await page.evaluate((operation) => {
                window.defaultQueueResolvers = [];
                window.namedQueueResolvers = [];

                operation('.queue', (node) => {
                    node.dataset.test1 = 'Test';
                });
                operation('.queue', () =>
                    new Promise((resolve) => {
                        window.defaultQueueResolvers.push(resolve);
                    }),
                );
                operation('.queue', (node) => {
                    node.dataset.test2 = 'Test';
                }, { queueName: 'test' });
                operation('.queue', () =>
                    new Promise((resolve) => {
                        window.namedQueueResolvers.push(resolve);
                    }),
                { queueName: 'test' });
            }, operation);

            await advanceClock(page, 1);

            await expect(page.locator('#test2')).toHaveAttribute('data-test1', 'Test');
            await expect(page.locator('#test2')).toHaveAttribute('data-test2', 'Test');
            await expect(page.locator('#test4')).toHaveAttribute('data-test1', 'Test');
            await expect(page.locator('#test4')).toHaveAttribute('data-test2', 'Test');
            expect(await page.locator('#test1').getAttribute('data-test1')).toBeNull();
            expect(await page.locator('#test1').getAttribute('data-test2')).toBeNull();
            expect(await page.locator('#test3').getAttribute('data-test1')).toBeNull();
            expect(await page.locator('#test3').getAttribute('data-test2')).toBeNull();
        });
    });
}
