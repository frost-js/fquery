import { setup, withAnimationTests } from '#cases/traversal/filter/with-animation.js';
import { expect, test } from '#test';

test.describe('QuerySet #withAnimation', () => {
    test.beforeEach(setup);

    withAnimationTests((nodes) => $(nodes).withAnimation().get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.withAnimation();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });
});
