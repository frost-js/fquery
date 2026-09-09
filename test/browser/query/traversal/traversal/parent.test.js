import { parentTests, setup } from '#cases/traversal/traversal/parent.js';
import { expect, test } from '#test';

test.describe('QuerySet #parent', () => {
    test.beforeEach(setup);

    parentTests(([nodes, ...args]) => $(nodes).parent(...args).get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('a');
            const query2 = query1.parent();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parent((node) => node.id === 'span2').get().map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parent(document.getElementById('span2')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parent(document.querySelectorAll('#span2')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parent(document.getElementById('child2').children).get().map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parent([document.getElementById('span2')]).get().map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with QuerySet filter', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('#span2');

            return $('a').parent(query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'span2',
        ]);
    });
});
