import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="div1" data-filter="test"></div><div id="div2"></div><div id="div3" data-filter="test"></div><div id="div4"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #not', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns nodes not matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').not('[data-filter="test"]').get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.not('[data-filter="test"]');

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            fragment.id = 'fragment';

            return $(fragment).not('[data-filter="test"]').get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'fragment',
        ]);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            shadow.id = 'shadow';

            return $(shadow).not('[data-filter="test"]').get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').not((node) => node.dataset.filter === 'test').get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').not(document.getElementById('div1')).get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div3',
            'div4',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').not(document.querySelectorAll('[data-filter="test"]')).get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').not(document.body.children).get().map((node) => node.id));

        expect(ids).toEqual([]);
    });

    test('works with DocumentFragment filter', async ({ page }) => {
        const nodes = await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            fragment.id = 'fragment';

            return $([fragment]).not(fragment).get();
        });

        expect(nodes).toEqual([]);
    });

    test('works with ShadowRoot filter', async ({ page }) => {
        const nodes = await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            shadow.id = 'shadow';

            return $([shadow]).not(shadow).get();
        });

        expect(nodes).toEqual([]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div')
                .not([
                    document.getElementById('div1'),
                    document.getElementById('div3'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with QuerySet filter', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('[data-filter="test"]');

            return $('div').not(query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });
});
