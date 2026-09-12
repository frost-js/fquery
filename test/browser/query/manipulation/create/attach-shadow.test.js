import { attachShadowTests, setup } from '#cases/manipulation/create/attach-shadow.js';
import { expect, test } from '#test';

test.describe('QuerySet #attachShadow', () => {
    test.beforeEach(setup);

    attachShadowTests(([nodes, ...args]) => $(nodes).attachShadow(...args).get(0));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const rootQuery = $('#test');
            const shadowQuery = rootQuery.attachShadow();

            return shadowQuery.constructor.name === 'QuerySet' && rootQuery !== shadowQuery;
        });

        expect(isNewQuerySet).toBe(true);
    });
});
