import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1"><div id="child1"><span id="span1"><a id="a1"></a></span></div></div><div id="parent2"><div id="child2"><span id="span2"><a id="a2"></a></span></div></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #parents', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the parents of each node', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parents().get().map((node) => node.id));

        expect(ids).toEqual([
            'html',
            'body',
            'parent1',
            'child1',
            'span1',
            'parent2',
            'child2',
            'span2',
        ]);
    });

    test('returns the parents of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parents('div').get().map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
            'parent2',
            'child2',
        ]);
    });

    test('returns the parents of each node before a limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parents(null, 'div').get().map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('a');
            const query2 = query1.parents();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parents((node) => node.tagName === 'DIV').get().map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
            'parent2',
            'child2',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parents(document.getElementById('child1')).get().map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parents(document.querySelectorAll('div')).get().map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
            'parent2',
            'child2',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parents(document.body.children).get().map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'parent2',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a')
                .parents([
                    document.getElementById('parent1'),
                    document.getElementById('child1'),
                    document.getElementById('parent2'),
                    document.getElementById('child2'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
            'parent2',
            'child2',
        ]);
    });

    test('works with QuerySet filter', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('div');

            return $('a').parents(query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'parent1',
            'child1',
            'parent2',
            'child2',
        ]);
    });

    test('works with function limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parents(null, (node) => node.id === 'body').get().map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
            'span1',
            'parent2',
            'child2',
            'span2',
        ]);
    });

    test('works with HTMLElement limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parents(null, document.body).get().map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
            'span1',
            'parent2',
            'child2',
            'span2',
        ]);
    });

    test('works with NodeList limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parents(null, document.querySelectorAll('div')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('works with HTMLCollection limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').parents(null, document.body.children).get().map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'span1',
            'child2',
            'span2',
        ]);
    });

    test('works with array limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a')
                .parents(null, [
                    document.getElementById('parent1'),
                    document.getElementById('parent2'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'span1',
            'child2',
            'span2',
        ]);
    });

    test('works with QuerySet limit', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('div');

            return $('a').parents(null, query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });
});
