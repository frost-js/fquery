import { expect, test } from '#test';
import { advanceClock } from '../../../setup/browser.js';

test.use({ mockClock: true });

test.describe('QuerySet #clearQueue', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<div id="test1"></div>' +
                '<div id="test2" class="queue"></div>' +
                '<div id="test3"></div>' +
                '<div id="test4" class="queue"></div>';
        });
    });

    test('returns the QuerySet', async ({ page }) => {
        const isSameQuerySet = await page.evaluate(() => {
            const query = $('.queue');

            return query === query.clearQueue();
        });

        expect(isSameQuerySet).toBe(true);
    });

    test.describe('clearing', () => {
        test('clears the queue for each node', async ({ page }) => {
            await page.evaluate(() => {
                $.queue('.queue', (node) => {
                    node.dataset.test = 'Test';
                });
                $('.queue').clearQueue();
            });

            await advanceClock(page, 200);

            expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();
        });

        test('clears future queued items', async ({ page }) => {
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

            await page.evaluate(() => {
                $('.queue').clearQueue();

                window.queueResolvers.splice(0).forEach((resolve) => {
                    resolve();
                });
            });

            await advanceClock(page, 200);

            expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();
        });
    });

    test.describe('named queues', () => {
        test('clears named queue', async ({ page }) => {
            await page.evaluate(() => {
                window.defaultQueueResolvers = [];
                window.namedQueueResolvers = [];

                $('.queue').queue(() =>
                    new Promise((resolve) => {
                        window.defaultQueueResolvers.push(resolve);
                    }),
                );
                $('.queue').queue(() =>
                    new Promise((resolve) => {
                        window.namedQueueResolvers.push(resolve);
                    }),
                { queueName: 'test' });
                $('.queue').queue((node) => {
                    node.dataset.test1 = 'Test';
                });
                $('.queue').queue((node) => {
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

            await page.evaluate(() => {
                $('.queue').clearQueue({ queueName: 'test' });

                window.defaultQueueResolvers.splice(0).forEach((resolve) => {
                    resolve();
                });
                window.namedQueueResolvers.splice(0).forEach((resolve) => {
                    resolve();
                });
            });

            await advanceClock(page, 200);

            await expect(page.locator('#test2')).toHaveAttribute('data-test1', 'Test');
            await expect(page.locator('#test4')).toHaveAttribute('data-test1', 'Test');
            expect(await page.locator('#test2').getAttribute('data-test2')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test2')).toBeNull();
        });

        test('clears all queues', async ({ page }) => {
            await page.evaluate(() => {
                window.defaultQueueResolvers = [];
                window.namedQueueResolvers = [];

                $('.queue').queue(() =>
                    new Promise((resolve) => {
                        window.defaultQueueResolvers.push(resolve);
                    }),
                );
                $('.queue').queue(() =>
                    new Promise((resolve) => {
                        window.namedQueueResolvers.push(resolve);
                    }),
                { queueName: 'test' });
                $('.queue').queue((node) => {
                    node.dataset.test1 = 'Test';
                });
                $('.queue').queue((node) => {
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

            await page.evaluate(() => {
                $('.queue').clearQueue({ queueName: null });

                window.defaultQueueResolvers.splice(0).forEach((resolve) => {
                    resolve();
                });
                window.namedQueueResolvers.splice(0).forEach((resolve) => {
                    resolve();
                });
            });

            await advanceClock(page, 200);

            expect(await page.locator('#test2').getAttribute('data-test1')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test1')).toBeNull();
            expect(await page.locator('#test2').getAttribute('data-test2')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test2')).toBeNull();
        });
    });
});
