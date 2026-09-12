import { detachTests, setup } from '#cases/manipulation/manipulation/detach.js';
import { expect, test } from '#test';

test.describe('QuerySet #detach', () => {
    test.beforeEach(setup);

    detachTests(() => (nodes, ...args) => $(nodes).detach(...args).get());

    test('returns the QuerySet', async ({ page }) => {
        const returnsSameQuery = await page.evaluate(() => {
            const query = $('a');

            return query === query.detach();
        });

        expect(returnsSameQuery).toBe(true);
    });
});
