import { clearQueueTests, setup } from '#cases/queue/clear-queue.js';
import { expect, test } from '#test';

test.use({ mockClock: true });

test.describe('QuerySet #clearQueue', () => {
    test.beforeEach(setup);

    clearQueueTests(() => (nodes, ...args) => {
        $(nodes).clearQueue(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const isSameQuerySet = await page.evaluate(() => {
            const query = $('.queue');

            return query === query.clearQueue();
        });

        expect(isSameQuerySet).toBe(true);
    });
});
