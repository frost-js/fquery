import { clearQueueTests, setup } from '#cases/queue/clear-queue.js';
import { expect, test } from '#test';
import { advanceClock } from '../../../setup/browser.js';

test.use({ mockClock: true });

test.describe('#clearQueue', () => {
    test.beforeEach(setup);

    clearQueueTests(() => $.clearQueue);

    test.describe('named queues', () => {
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

            await advanceClock(page, 200);

            expect(await page.locator('#test2').getAttribute('data-test1')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test1')).toBeNull();
            await expect(page.locator('#test2')).toHaveAttribute('data-test2', 'Test');
            await expect(page.locator('#test4')).toHaveAttribute('data-test2', 'Test');
        });
    });

    test.describe('inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.queue('.queue', (node) => {
                    node.dataset.test = 'Test';
                });
                $.clearQueue(document.getElementById('test2'));
            });

            await advanceClock(page, 200);

            expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
            await expect(page.locator('#test4')).toHaveAttribute('data-test', 'Test');
            expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.queue('.queue', (node) => {
                    node.dataset.test = 'Test';
                });
                $.clearQueue(document.querySelectorAll('.queue'));
            });

            await advanceClock(page, 200);

            expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.queue('.queue', (node) => {
                    node.dataset.test = 'Test';
                });
                $.clearQueue(document.body.children);
            });

            await advanceClock(page, 200);

            expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();
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

            await advanceClock(page, 200);

            expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
        });
    });
});
