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

test.describe('#queue', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, QUEUE_HTML);
    });

    test('queues a callback for each node', async ({ page }) => {
        await page.evaluate(() => {
            $.queue('.queue', (node) => {
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
            $.queue('.queue', (node) => {
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

            $.queue('.queue', () =>
                new Promise((resolve) => {
                    window.queueResolvers.push(resolve);
                }),
            );
            $.queue('.queue', (node) => {
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

            $.queue('.queue', () =>
                new Promise((_, reject) => {
                    window.queueRejectors.push(reject);
                }),
            );
            $.queue('.queue', (node) => {
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

        await expect.poll(async () => await page.locator('#test2').getAttribute('data-test')).toBeNull();
        await expect.poll(async () => await page.locator('#test4').getAttribute('data-test')).toBeNull();
    });

    test('processes multiple queues simultaneously', async ({ page }) => {
        await page.evaluate(() => {
            window.defaultQueueResolvers = [];
            window.namedQueueResolvers = [];

            $.queue('.queue', (node) => {
                node.dataset.test1 = 'Test';
            });
            $.queue('.queue', () =>
                new Promise((resolve) => {
                    window.defaultQueueResolvers.push(resolve);
                }),
            );
            $.queue('.queue', (node) => {
                node.dataset.test2 = 'Test';
            }, { queueName: 'test' });
            $.queue('.queue', () =>
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

        await expect.poll(async () => await page.evaluate(() => Boolean(window.namedQueueResolver))).toBe(true);

        await page.evaluate(() => {
            $.queue('#test2', (node) => {
                node.dataset.default = 'Test';
            });
        });

        await expect(page.locator('#test2')).toHaveAttribute('data-default', 'Test');

        await page.evaluate(() => {
            window.namedQueueResolver();
        });

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

        await expect.poll(async () => await page.evaluate(() => Boolean(window.namedQueueResolver))).toBe(true);

        await page.evaluate(() => {
            $.queue('#test2', () =>
                new Promise((_, reject) => {
                    window.defaultQueueRejector = reject;
                }),
            );
        });

        await expect.poll(async () => await page.evaluate(() => Boolean(window.defaultQueueRejector))).toBe(true);

        await page.evaluate(async () => {
            window.defaultQueueRejector();
            await new Promise((resolve) => {
                setTimeout(resolve);
            });
            window.namedQueueResolver();
        });

        await expect(page.locator('#test2')).toHaveAttribute('data-named', 'Test');
    });

    test('works with special queue names', async ({ page }) => {
        await page.evaluate(() => {
            $.queue('#test2', (node) => {
                node.dataset.test = 'Test';
            }, { queueName: '__proto__' });
        });

        await expect(page.locator('#test2')).toHaveAttribute('data-test', 'Test');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.queue(
                document.getElementById('test2'),
                (node) => {
                    node.dataset.test = 'Test';
                },
            );
        });

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

        await expect(page.locator('#test2')).toHaveAttribute('data-test', 'Test');
        await expect(page.locator('#test4')).toHaveAttribute('data-test', 'Test');
        expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
        expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
    });
});
