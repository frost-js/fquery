import { expect, test } from '#test';
import { resetPage } from '../../../setup/browser.js';

const QUEUE_HTML =
    '<div id="test1"></div>' +
    '<div id="test2" class="queue"></div>' +
    '<div id="test3"></div>' +
    '<div id="test4" class="queue"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #clearQueue', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, QUEUE_HTML);
    });

    test('clears the queue for each node', async ({ page }) => {
        await page.evaluate(() => {
            $.queue('.queue', (node) => {
                node.dataset.test = 'Test';
            });
            $('.queue').clearQueue();
        });

        await expect.poll(async () => await page.locator('#test2').getAttribute('data-test'), {
            timeout: 200,
        }).toBeNull();
        await expect.poll(async () => await page.locator('#test4').getAttribute('data-test'), {
            timeout: 200,
        }).toBeNull();
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
            $('.queue').clearQueue();
        });

        await page.evaluate(() => {
            window.queueResolvers.splice(0).forEach((resolve) => {
                resolve();
            });
        });

        await expect.poll(async () => await page.locator('#test2').getAttribute('data-test'), {
            timeout: 200,
        }).toBeNull();
        await expect.poll(async () => await page.locator('#test4').getAttribute('data-test'), {
            timeout: 200,
        }).toBeNull();
    });

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

        await expect.poll(async () => await page.locator('#test2').getAttribute('data-test1'), {
            timeout: 200,
        }).toBeNull();
        await expect.poll(async () => await page.locator('#test4').getAttribute('data-test1'), {
            timeout: 200,
        }).toBeNull();
        await expect.poll(async () => await page.locator('#test2').getAttribute('data-test2'), {
            timeout: 200,
        }).toBeNull();
        await expect.poll(async () => await page.locator('#test4').getAttribute('data-test2'), {
            timeout: 200,
        }).toBeNull();
    });

    test('returns the QuerySet', async ({ page }) => {
        const isSameQuerySet = await page.evaluate(() => {
            const query = $('.queue');

            return query === query.clearQueue();
        });

        expect(isSameQuerySet).toBe(true);
    });
});
