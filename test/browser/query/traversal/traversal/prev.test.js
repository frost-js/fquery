import { prevTests, setup } from '#cases/traversal/traversal/prev.js';
import { expect, test } from '#test';

test.describe('QuerySet #prev', () => {
    test.beforeEach(setup);

    prevTests(([nodes, ...args]) => $(nodes).prev(...args).get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('.span');
            const query2 = query1.prev();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prev((node) => node.id === 'span6').get().map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prev(document.getElementById('span6')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prev(document.querySelectorAll('#span6')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prev(document.getElementById('parent2').children).get().map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span')
                .prev([
                    document.getElementById('span2'),
                    document.getElementById('span6'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'span2',
            'span6',
        ]);
    });

    test('works with QuerySet filter', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('#span6');

            return $('.span').prev(query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'span6',
        ]);
    });
});
