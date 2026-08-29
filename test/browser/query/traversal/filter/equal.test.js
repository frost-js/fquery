import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1"><span data-id="span1"></span><span data-id="span2"></span><span data-id="span3"></span></div><div id="parent2"><span data-id="span2"></span><span data-id="span3"></span><span data-id="span4"></span></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #equal', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns nodes equal to other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('#parent1 span').equal('#parent2 span').get().map((node) => node.dataset.id));

        expect(ids).toEqual([
            'span2',
            'span3',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('#parent1 span');
            const query2 = query1.equal('#parent2 span');

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const fragment1 = document.createDocumentFragment();
            const fragment2 = document.createDocumentFragment();
            fragment1.id = 'fragment';

            return $(fragment1).equal([fragment2]).get().map((node) => node.id);
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

            return $(shadow1).equal([shadow2]).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });

    test('works with HTMLElement other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('#parent1 span')
                .equal(document.querySelector('#parent2 > [data-id="span2"]'))
                .get()
                .map((node) => node.dataset.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with NodeList other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('#parent1 span')
                .equal(document.querySelectorAll('#parent2 > span'))
                .get()
                .map((node) => node.dataset.id));

        expect(ids).toEqual([
            'span2',
            'span3',
        ]);
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('#parent1 span')
                .equal(document.getElementById('parent2').children)
                .get()
                .map((node) => node.dataset.id));

        expect(ids).toEqual([
            'span2',
            'span3',
        ]);
    });

    test('works with DocumentFragment other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const fragment1 = document.createDocumentFragment();
            const fragment2 = document.createDocumentFragment();
            fragment1.id = 'fragment';

            return $([fragment1]).equal(fragment2).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'fragment',
        ]);
    });

    test('works with ShadowRoot other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');
            const shadow1 = div1.attachShadow({ mode: 'open' });
            const shadow2 = div2.attachShadow({ mode: 'closed' });
            shadow1.id = 'shadow';

            return $([shadow1]).equal(shadow2).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });

    test('works with array other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('#parent1 span')
                .equal([
                    document.querySelector('#parent2 > [data-id="span2"]'),
                    document.querySelector('#parent2 > [data-id="span3"]'),
                ])
                .get()
                .map((node) => node.dataset.id));

        expect(ids).toEqual([
            'span2',
            'span3',
        ]);
    });

    test('works with QuerySet other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('#parent2 > [data-id="span2"]');

            return $('#parent1 span').equal(query).get().map((node) => node.dataset.id);
        });

        expect(ids).toEqual([
            'span2',
        ]);
    });
});
