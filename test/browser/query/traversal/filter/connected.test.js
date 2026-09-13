import { connectedTests, setup } from '#cases/traversal/filter/connected.js';
import { expect, test } from '#test';

test.describe('QuerySet #connected', () => {
    test.beforeEach(setup);

    connectedTests((nodes) => $(nodes).connected().get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.connected();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('node inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            const nodes = await page.evaluate((_) => {
                const fragment = document.createDocumentFragment();

                return $(fragment).connected().get();
            });

            expect(nodes).toEqual([]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const div = document.getElementById('div1');
                const shadow = div.attachShadow({ mode: 'open' });
                shadow.id = 'shadow';

                return $(shadow).connected().get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'shadow',
            ]);
        });
    });
});
