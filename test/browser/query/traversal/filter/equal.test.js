import { equalTests, setup } from '#cases/traversal/filter/equal.js';
import { expect, test } from '#test';

test.describe('QuerySet #equal', () => {
    test.beforeEach(setup);

    equalTests(([nodes, ...args]) => $(nodes).equal(...args).get().map((node) => node.dataset.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('#parent1 span');
            const query2 = query1.equal('#parent2 span');

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('source inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const fragment1 = document.createDocumentFragment();
                const fragment2 = document.createDocumentFragment();
                fragment1.id = 'fragment';

                return $(fragment1).equal([fragment2]).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'fragment',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const div1 = document.createElement('div');
                const div2 = document.createElement('div');
                const shadow1 = div1.attachShadow({ mode: 'open' });
                const shadow2 = div2.attachShadow({ mode: 'closed' });
                shadow1.id = 'shadow';

                return $(shadow1).equal([shadow2]).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'shadow',
            ]);
        });
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet other nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const query = $('#parent2 > [data-id="span2"]');

                return $('#parent1 span').equal(query).get().map((node) => node.dataset.id);
            });

            expect(ids).toEqual([
                'span2',
            ]);
        });
    });

    test.describe('comparison inputs', () => {
        test('works with DocumentFragment other nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const fragment1 = document.createDocumentFragment();
                const fragment2 = document.createDocumentFragment();
                fragment1.id = 'fragment';

                return $([fragment1]).equal(fragment2).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'fragment',
            ]);
        });

        test('works with ShadowRoot other nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const div1 = document.createElement('div');
                const div2 = document.createElement('div');
                const shadow1 = div1.attachShadow({ mode: 'open' });
                const shadow2 = div2.attachShadow({ mode: 'closed' });
                shadow1.id = 'shadow';

                return $([shadow1]).equal(shadow2).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'shadow',
            ]);
        });
    });
});
