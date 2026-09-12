import { equalTests, setup } from '#cases/traversal/filter/equal.js';
import { expect, test } from '#test';

test.describe('#equal', () => {
    test.beforeEach(setup);

    equalTests((args) => $.equal(...args).map((node) => node.dataset?.id ?? node.id));

    test.describe('source inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.equal(document.querySelector('#parent1 [data-id="span2"]'), '#parent2 span').map((node) => node.dataset.id));

            expect(ids).toEqual([
                'span2',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.equal(document.querySelectorAll('#parent1 span'), '#parent2 span').map((node) => node.dataset.id));

            expect(ids).toEqual([
                'span2',
                'span3',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.equal(document.getElementById('parent1').children, '#parent2 span').map((node) => node.dataset.id));

            expect(ids).toEqual([
                'span2',
                'span3',
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const fragment1 = document.createDocumentFragment();
                const fragment2 = document.createDocumentFragment();
                fragment1.id = 'fragment';

                return $.equal(fragment1, [fragment2]).map((node) => node.id);
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

                return $.equal(shadow1, [shadow2]).map((node) => node.id);
            });

            expect(ids).toEqual([
                'shadow',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.equal([
                    document.querySelector('#parent1 > [data-id="span1"]'),
                    document.querySelector('#parent1 > [data-id="span2"]'),
                    document.querySelector('#parent1 > [data-id="span3"]'),
                ], '#parent2 span').map((node) => node.dataset.id));

            expect(ids).toEqual([
                'span2',
                'span3',
            ]);
        });
    });
});
