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

test.describe('QuerySet #queue', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, QUEUE_HTML);
    });

    test('queues a callback for each node', async ({ page }) => {
        await page.evaluate(() => {
            $('.queue').queue((node) => {
                node.dataset.test = 'Test';
            });
        });

        await expect(page.locator('#test2')).toHaveAttribute('data-test', 'Test');
        await expect(page.locator('#test4')).toHaveAttribute('data-test', 'Test');
        expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
        expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
    });

    test('does not execute the callback immediately', async ({ page }) => {
        const values = await page.evaluate(() => {
            $('.queue').queue((node) => {
                node.dataset.test = 'Test';
            });

            return [...document.body.children].map((node) => node.getAttribute('data-test'));
        });

        expect(values).toEqual([
            null,
            null,
            null,
            null,
        ]);
    });

    test('only executes callbacks after the previous item is resolved', async ({ page }) => {
        await page.evaluate(() => {
            window.queueResolvers = [];

            $('.queue').queue(() =>
                new Promise((resolve) => {
                    window.queueResolvers.push(resolve);
                }),
            );
            $('.queue').queue((node) => {
                node.dataset.test = 'Test';
            });
        });

        expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
        expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();

        await page.evaluate(() => {
            window.queueResolvers.splice(0).forEach((resolve) => {
                resolve();
            });
        });

        await expect(page.locator('#test2')).toHaveAttribute('data-test', 'Test');
        await expect(page.locator('#test4')).toHaveAttribute('data-test', 'Test');
    });

    test('does not continue the queue if an item is rejected', async ({ page }) => {
        await page.evaluate(() => {
            window.queueRejectors = [];

            $('.queue').queue(() =>
                new Promise((_, reject) => {
                    window.queueRejectors.push(reject);
                }),
            );
            $('.queue').queue((node) => {
                node.dataset.test = 'Test';
            });
        });

        expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
        expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();

        await page.evaluate(() => {
            window.queueRejectors.splice(0).forEach((reject) => {
                reject();
            });
        });

        await expect.poll(async () => await page.locator('#test2').getAttribute('data-test'), {
            timeout: 200,
        }).toBeNull();
        await expect.poll(async () => await page.locator('#test4').getAttribute('data-test'), {
            timeout: 200,
        }).toBeNull();
    });

    test('processes multiple queues simultaneously', async ({ page }) => {
        await page.evaluate(() => {
            window.defaultQueueResolvers = [];
            window.namedQueueResolvers = [];

            $('.queue').queue((node) => {
                node.dataset.test1 = 'Test';
            });
            $('.queue').queue(() =>
                new Promise((resolve) => {
                    window.defaultQueueResolvers.push(resolve);
                }),
            );
            $('.queue').queue((node) => {
                node.dataset.test2 = 'Test';
            }, { queueName: 'test' });
            $('.queue').queue(() =>
                new Promise((resolve) => {
                    window.namedQueueResolvers.push(resolve);
                }),
            { queueName: 'test' });
        });

        await expect(page.locator('#test2')).toHaveAttribute('data-test1', 'Test');
        await expect(page.locator('#test2')).toHaveAttribute('data-test2', 'Test');
        await expect(page.locator('#test4')).toHaveAttribute('data-test1', 'Test');
        await expect(page.locator('#test4')).toHaveAttribute('data-test2', 'Test');
        expect(await page.locator('#test1').getAttribute('data-test1')).toBeNull();
        expect(await page.locator('#test1').getAttribute('data-test2')).toBeNull();
        expect(await page.locator('#test3').getAttribute('data-test1')).toBeNull();
        expect(await page.locator('#test3').getAttribute('data-test2')).toBeNull();
    });

    test('returns the QuerySet', async ({ page }) => {
        const isSameQuerySet = await page.evaluate(() => {
            const query = $('.queue');

            return query === query.queue(() => {});
        });

        expect(isSameQuerySet).toBe(true);
    });
});
