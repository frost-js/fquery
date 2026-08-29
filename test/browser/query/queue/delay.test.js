import { expect, test } from '#test';
import { advanceClock, resetPage, setupClock } from '../../../setup/browser.js';

const QUEUE_HTML =
    '<div id="test1"></div>' +
    '<div id="test2" class="queue"></div>' +
    '<div id="test3"></div>' +
    '<div id="test4" class="queue"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #delay', () => {
    test.beforeEach(async ({ page }) => {
        await setupClock(page);

        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, QUEUE_HTML);
    });

    test('delays execution of the next queued item', async ({ page }) => {
        await page.evaluate(() => {
            $('.queue').delay(100);
            $('.queue').queue((node) => {
                node.dataset.test = 'Test';
            });
        });

        expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
        expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
        expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
        expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();

        await advanceClock(page, 100);

        await expect(page.locator('#test2')).toHaveAttribute('data-test', 'Test');
        await expect(page.locator('#test4')).toHaveAttribute('data-test', 'Test');
    });

    test('works with named queue', async ({ page }) => {
        await page.evaluate(() => {
            $('.queue').delay(100, { queueName: 'test' });
            $('.queue').queue((node) => {
                node.dataset.test1 = 'Test';
            });
            $('.queue').queue((node) => {
                node.dataset.test2 = 'Test';
            }, { queueName: 'test' });
        });

        await advanceClock(page, 1);

        await expect(page.locator('#test2')).toHaveAttribute('data-test1', 'Test');
        await expect(page.locator('#test4')).toHaveAttribute('data-test1', 'Test');
        expect(await page.locator('#test2').getAttribute('data-test2')).toBeNull();
        expect(await page.locator('#test4').getAttribute('data-test2')).toBeNull();
        expect(await page.locator('#test1').getAttribute('data-test1')).toBeNull();
        expect(await page.locator('#test1').getAttribute('data-test2')).toBeNull();
        expect(await page.locator('#test3').getAttribute('data-test1')).toBeNull();
        expect(await page.locator('#test3').getAttribute('data-test2')).toBeNull();
    });

    test('returns the QuerySet', async ({ page }) => {
        const isSameQuerySet = await page.evaluate(() => {
            const query = $('.queue');

            return query === query.delay(() => {});
        });

        expect(isSameQuerySet).toBe(true);
    });
});
