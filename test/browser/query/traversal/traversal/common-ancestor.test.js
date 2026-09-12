import { commonAncestorTests, setup } from '#cases/traversal/traversal/common-ancestor.js';
import { expect, test } from '#test';

test.describe('QuerySet #commonAncestor', () => {
    test.beforeEach(setup);

    commonAncestorTests((nodes) => $(nodes).commonAncestor().get().map((node) => node.id), { querySet: true });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('a');
            const query2 = query1.commonAncestor();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });
});
