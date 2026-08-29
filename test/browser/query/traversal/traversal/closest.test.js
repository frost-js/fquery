import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1"><div id="child1"><span id="span1"><a id="a1"></a></span></div></div><div id="parent2"><div id="child2"><span id="span2"><a id="a2"></a></span></div></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #closest', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the closest ancestor of each node', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').closest().get().map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('returns the closest ancestor of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').closest('div').get().map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'child2',
        ]);
    });

    test('returns the closest ancestor of each node before a limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').closest('div', '#span2').get().map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('a');
            const query2 = query1.closest();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').closest((node) => node.tagName === 'DIV').get().map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'child2',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').closest(document.getElementById('child1')).get().map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').closest(document.querySelectorAll('div')).get().map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'child2',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').closest(document.body.children).get().map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'parent2',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a')
                .closest([
                    document.getElementById('child1'),
                    document.getElementById('child2'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'child2',
        ]);
    });

    test('works with QuerySet filter', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('div');

            return $('a').closest(query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'child1',
            'child2',
        ]);
    });

    test('works with function limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').closest('div', (node) => node.id === 'span2').get().map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('works with HTMLElement limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').closest('div', document.getElementById('span2')).get().map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('works with NodeList limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').closest('div', document.querySelectorAll('#span2')).get().map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('works with HTMLCollection limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').closest('div', document.getElementById('child2').children).get().map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('works with array limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').closest('div', [document.getElementById('span2')]).get().map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('works with QuerySet limit', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('#span2');

            return $('a').closest('div', query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'child1',
        ]);
    });
});
