import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="div1"></div><div id="div2" data-filter="test"></div><div id="div3"></div><div id="div4" data-filter="test"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #filter', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns filtered nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').filter('[data-filter="test"]').get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.filter('[data-filter="test"]');

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            fragment.id = 'fragment';

            return $(fragment).filter().get().map((node) => node.id);
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

            return $(shadow).filter().get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').filter((node) => node.dataset.filter === 'test').get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').filter(document.getElementById('div2')).get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').filter(document.querySelectorAll('[data-filter="test"]')).get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').filter(document.body.children).get().map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div2',
            'div3',
            'div4',
        ]);
    });

    test('works with DocumentFragment filter', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            fragment.id = 'fragment';

            return $([fragment]).filter(fragment).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'fragment',
        ]);
    });

    test('works with ShadowRoot filter', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            shadow.id = 'shadow';

            return $([shadow]).filter(shadow).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div')
                .filter([
                    document.getElementById('div2'),
                    document.getElementById('div4'),
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

            return $('div').filter(query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });
});
