import { setup, withCSSTransitionTests } from '#cases/traversal/filter/with-css-transition.js';
import { expect, test } from '#test';

test.describe('QuerySet #withCSSTransition', () => {
    test.beforeEach(setup);

    withCSSTransitionTests((nodes) => $(nodes).withCSSTransition().get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.withCSSTransition();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });
});
