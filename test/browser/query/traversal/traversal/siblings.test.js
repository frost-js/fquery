import { setup, siblingsTests } from '#cases/traversal/traversal/siblings.js';
import { expect, test } from '#test';

test.describe('QuerySet #siblings', () => {
    test.beforeEach(setup);

    siblingsTests(([nodes, ...args]) => $(nodes).siblings(...args).get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('.span');
            const query2 = query1.siblings();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').siblings((node) => node.id === 'span5').get().map((node) => node.id));

        expect(ids).toEqual([
            'span5',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').siblings(document.getElementById('span1')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span1',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').siblings(document.querySelectorAll('#span1, #span10')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span10',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').siblings(document.getElementById('parent2').children).get().map((node) => node.id));

        expect(ids).toEqual([
            'span6',
            'span7',
            'span9',
            'span10',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span')
                .siblings([
                    document.getElementById('span1'),
                    document.getElementById('span10'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span10',
        ]);
    });

    test('works with QuerySet filter', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('#span1, #span10');

            return $('.span').siblings(query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'span1',
            'span10',
        ]);
    });
});
