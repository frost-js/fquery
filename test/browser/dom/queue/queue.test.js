import { queueTests, setup } from '#cases/queue/queue.js';
import { expect, test } from '#test';
import { advanceClock } from '../../../setup/browser.js';

test.use({ mockClock: true });

test.describe('#queue', () => {
    test.beforeEach(setup);

    queueTests(() => $.queue);

    test.describe('named queues', () => {
        test('keeps named queues when another queue completes', async ({ page }) => {
            await page.evaluate(() => {
                window.namedQueueResolver = null;

                $.queue('#test2', () =>
                    new Promise((resolve) => {
                        window.namedQueueResolver = resolve;
                    }),
                { queueName: 'test' });
                $.queue('#test2', (node) => {
                    node.dataset.named = 'Test';
                }, { queueName: 'test' });
            });

            await advanceClock(page, 1);

            await expect.poll(async () => await page.evaluate(() => Boolean(window.namedQueueResolver))).toBe(true);

            await page.evaluate(() => {
                $.queue('#test2', (node) => {
                    node.dataset.default = 'Test';
                });
            });

            await advanceClock(page, 1);

            await expect(page.locator('#test2')).toHaveAttribute('data-default', 'Test');

            await page.evaluate(() => {
                window.namedQueueResolver();
            });

            await advanceClock(page, 1);

            await expect(page.locator('#test2')).toHaveAttribute('data-named', 'Test');
        });

        test('keeps named queues when another queue rejects', async ({ page }) => {
            await page.evaluate(() => {
                window.defaultQueueRejector = null;
                window.namedQueueResolver = null;

                $.queue('#test2', () =>
                    new Promise((resolve) => {
                        window.namedQueueResolver = resolve;
                    }),
                { queueName: 'test' });
                $.queue('#test2', (node) => {
                    node.dataset.named = 'Test';
                }, { queueName: 'test' });
            });

            await advanceClock(page, 1);

            await expect.poll(async () => await page.evaluate(() => Boolean(window.namedQueueResolver))).toBe(true);

            await page.evaluate(() => {
                $.queue('#test2', () =>
                    new Promise((_, reject) => {
                        window.defaultQueueRejector = reject;
                    }),
                );
            });

            await advanceClock(page, 1);

            await expect.poll(async () => await page.evaluate(() => Boolean(window.defaultQueueRejector))).toBe(true);

            await page.evaluate(() => {
                window.defaultQueueRejector();
            });

            await advanceClock(page, 1);

            await page.evaluate(() => {
                window.namedQueueResolver();
            });

            await advanceClock(page, 1);

            await expect(page.locator('#test2')).toHaveAttribute('data-named', 'Test');
        });

        test('works with special queue names', async ({ page }) => {
            await page.evaluate(() => {
                $.queue('#test2', (node) => {
                    node.dataset.test = 'Test';
                }, { queueName: '__proto__' });
            });

            await advanceClock(page, 1);

            await expect(page.locator('#test2')).toHaveAttribute('data-test', 'Test');
        });
    });

    test.describe('inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.queue(
                    document.getElementById('test2'),
                    (node) => {
                        node.dataset.test = 'Test';
                    },
                );
            });

            await advanceClock(page, 1);

            await expect(page.locator('#test2')).toHaveAttribute('data-test', 'Test');
            expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.queue(
                    document.querySelectorAll('.queue'),
                    (node) => {
                        node.dataset.test = 'Test';
                    },
                );
            });

            await advanceClock(page, 1);

            await expect(page.locator('#test2')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('#test4')).toHaveAttribute('data-test', 'Test');
            expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.queue(
                    document.body.children,
                    (node) => {
                        node.dataset.test = 'Test';
                    },
                );
            });

            await advanceClock(page, 1);

            await expect(page.locator('#test1')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('#test2')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('#test3')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('#test4')).toHaveAttribute('data-test', 'Test');
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.queue([
                    document.getElementById('test2'),
                    document.getElementById('test4'),
                ], (node) => {
                    node.dataset.test = 'Test';
                });
            });

            await advanceClock(page, 1);

            await expect(page.locator('#test2')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('#test4')).toHaveAttribute('data-test', 'Test');
            expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
        });
    });
});
