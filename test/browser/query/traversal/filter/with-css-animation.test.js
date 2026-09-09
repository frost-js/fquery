import { setup, withCSSAnimationTests } from '#cases/traversal/filter/with-css-animation.js';
import { expect, test } from '#test';

test.describe('QuerySet #withCSSAnimation', () => {
    test.beforeEach(setup);

    withCSSAnimationTests((nodes) => $(nodes).withCSSAnimation().get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.withCSSAnimation();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });
});
