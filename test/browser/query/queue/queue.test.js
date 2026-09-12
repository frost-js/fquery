import { queueTests, setup } from '#cases/queue/queue.js';
import { expect, test } from '#test';

test.use({ mockClock: true });

test.describe('QuerySet #queue', () => {
    test.beforeEach(setup);

    queueTests(() => (nodes, ...args) => {
        $(nodes).queue(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const isSameQuerySet = await page.evaluate(() => {
            const query = $('.queue');

            return query === query.queue(() => {});
        });

        expect(isSameQuerySet).toBe(true);
    });
});
