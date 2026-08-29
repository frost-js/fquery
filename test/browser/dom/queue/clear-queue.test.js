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

test.describe('#clearQueue', () => {
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
            $.clearQueue('.queue');
        });

        await expect.poll(async () => await page.locator('#test2').getAttribute('data-test')).toBeNull();
        await expect.poll(async () => await page.locator('#test4').getAttribute('data-test')).toBeNull();
        expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
        expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
    });

    test('clears only the default queue by default', async ({ page }) => {
        await page.evaluate(() => {
            $.queue('.queue', (node) => {
                node.dataset.test1 = 'Test';
            });
            $.queue('.queue', (node) => {
                node.dataset.test2 = 'Test';
            }, { queueName: 'test' });
            $.clearQueue('.queue');
        });

        expect(await page.locator('#test2').getAttribute('data-test1')).toBeNull();
        expect(await page.locator('#test4').getAttribute('data-test1')).toBeNull();
        await expect(page.locator('#test2')).toHaveAttribute('data-test2', 'Test');
        await expect(page.locator('#test4')).toHaveAttribute('data-test2', 'Test');
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
            $.clearQueue('.queue');
        });

        await page.evaluate(() => {
            window.queueResolvers.splice(0).forEach((resolve) => {
                resolve();
            });
        });

        await expect.poll(async () => await page.locator('#test2').getAttribute('data-test')).toBeNull();
        await expect.poll(async () => await page.locator('#test4').getAttribute('data-test')).toBeNull();
    });

    test('clears named queue', async ({ page }) => {
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

        await expect.poll(async () => await page.evaluate(() => ({
            default: window.defaultQueueResolvers.length,
            named: window.namedQueueResolvers.length,
        }))).toEqual({
            default: 2,
            named: 2,
        });

        await page.evaluate(() => {
            $.clearQueue('.queue', { queueName: 'test' });

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

        await expect.poll(async () => await page.evaluate(() => ({
            default: window.defaultQueueResolvers.length,
            named: window.namedQueueResolvers.length,
        }))).toEqual({
            default: 2,
            named: 2,
        });

        await page.evaluate(() => {
            $.clearQueue('.queue', { queueName: null });

            window.defaultQueueResolvers.splice(0).forEach((resolve) => {
                resolve();
            });
            window.namedQueueResolvers.splice(0).forEach((resolve) => {
                resolve();
            });
        });

        await expect.poll(async () => await page.locator('#test2').getAttribute('data-test1')).toBeNull();
        await expect.poll(async () => await page.locator('#test4').getAttribute('data-test1')).toBeNull();
        await expect.poll(async () => await page.locator('#test2').getAttribute('data-test2')).toBeNull();
        await expect.poll(async () => await page.locator('#test4').getAttribute('data-test2')).toBeNull();
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.queue('.queue', (node) => {
                node.dataset.test = 'Test';
            });
            $.clearQueue(
                document.getElementById('test2'),
            );
        });

        await expect.poll(async () => await page.locator('#test2').getAttribute('data-test')).toBeNull();
        await expect(page.locator('#test4')).toHaveAttribute('data-test', 'Test');
        expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
        expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.queue('.queue', (node) => {
                node.dataset.test = 'Test';
            });
            $.clearQueue(
                document.querySelectorAll('.queue'),
            );
        });

        await expect.poll(async () => await page.locator('#test2').getAttribute('data-test')).toBeNull();
        await expect.poll(async () => await page.locator('#test4').getAttribute('data-test')).toBeNull();
        expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
        expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.queue('.queue', (node) => {
                node.dataset.test = 'Test';
            });
            $.clearQueue(
                document.body.children,
            );
        });

        await expect.poll(async () => await page.locator('#test1').getAttribute('data-test')).toBeNull();
        await expect.poll(async () => await page.locator('#test2').getAttribute('data-test')).toBeNull();
        await expect.poll(async () => await page.locator('#test3').getAttribute('data-test')).toBeNull();
        await expect.poll(async () => await page.locator('#test4').getAttribute('data-test')).toBeNull();
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.queue('.queue', (node) => {
                node.dataset.test = 'Test';
            });
            $.clearQueue([
                document.getElementById('test2'),
                document.getElementById('test4'),
            ]);
        });

        await expect.poll(async () => await page.locator('#test2').getAttribute('data-test')).toBeNull();
        await expect.poll(async () => await page.locator('#test4').getAttribute('data-test')).toBeNull();
        expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
        expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
    });
});
