import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="div1"></div><div id="div2"></div><div id="div3"></div><div id="div4"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #same', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns nodes identical to other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').same('#div2, #div4').get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.same('#div2, #div4');

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            fragment.id = 'fragment';

            return $(fragment).same([fragment]).get().map((node) => node.id);
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

            return $(shadow).same([shadow]).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });

    test('works with HTMLElement other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').same(document.getElementById('div2')).get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
        ]);
    });

    test('works with NodeList other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').same(document.querySelectorAll('#div2, #div4')).get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').same(document.body.children).get().map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div2',
            'div3',
            'div4',
        ]);
    });

    test('works with DocumentFragment other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            fragment.id = 'fragment';

            return $([fragment]).same(fragment).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'fragment',
        ]);
    });

    test('works with ShadowRoot other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            shadow.id = 'shadow';

            return $([shadow]).same(shadow).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });

    test('works with array other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div')
                .same([
                    document.querySelector('#div2'),
                    document.querySelector('#div4'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with QuerySet other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('#div2, #div4');

            return $('div').same(query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });
});
