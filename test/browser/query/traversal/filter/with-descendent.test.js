import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="div1"><span id="span1"><a id="a1"></a></span></div><div id="div2"></div><div id="div3"><span id="span2"><a id="a2"></a></span></div><div id="div4"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #withDescendent', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns nodes with a descendent matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').withDescendent('a').get().map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.withDescendent('a');

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const range = document.createRange();
            const fragment = range.createContextualFragment('<div></div>');
            fragment.id = 'fragment';

            return $(fragment).withDescendent('div').get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'fragment',
        ]);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            const range = document.createRange();
            const fragment = range.createContextualFragment('<div></div>');

            shadow.appendChild(fragment);
            shadow.id = 'shadow';

            return $(shadow).withDescendent('div').get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $(document).withDescendent('div').get().map((node) => node.id));

        expect(ids).toEqual([
            'document',
        ]);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').withDescendent((node) => node.id === 'a1').get().map((node) => node.id));

        expect(ids).toEqual([
            'div1',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').withDescendent(document.getElementById('a1')).get().map((node) => node.id));

        expect(ids).toEqual([
            'div1',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').withDescendent(document.querySelectorAll('a')).get().map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').withDescendent(document.getElementById('span1').children).get().map((node) => node.id));

        expect(ids).toEqual([
            'div1',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div')
                .withDescendent([
                    document.getElementById('a1'),
                    document.getElementById('a2'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with QuerySet filter', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('a');

            return $('div').withDescendent(query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });
});
