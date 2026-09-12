import { setup, withCssAnimationTests } from '#cases/traversal/filter/with-css-animation.js';
import { expect, test } from '#test';

test.describe('QuerySet #withCssAnimation', () => {
    test.beforeEach(setup);

    withCssAnimationTests((nodes) => $(nodes).withCssAnimation().get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.withCssAnimation();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });
});
