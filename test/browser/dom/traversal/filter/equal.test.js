import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1"><span data-id="span1"></span><span data-id="span2"></span><span data-id="span3"></span></div><div id="parent2"><span data-id="span2"></span><span data-id="span3"></span><span data-id="span4"></span></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#equal', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns nodes equal to other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.equal('#parent1 span', '#parent2 span').map((node) => node.dataset.id));

        expect(ids).toEqual([
            'span2',
            'span3',
        ]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.equal(document.querySelector('#parent1 [data-id="span2"]'), '#parent2 span').map((node) => node.dataset.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.equal(document.querySelectorAll('#parent1 span'), '#parent2 span').map((node) => node.dataset.id));

        expect(ids).toEqual([
            'span2',
            'span3',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.equal(document.getElementById('parent1').children, '#parent2 span').map((node) => node.dataset.id));

        expect(ids).toEqual([
            'span2',
            'span3',
        ]);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const fragment1 = document.createDocumentFragment();
            const fragment2 = document.createDocumentFragment();
            fragment1.id = 'fragment';

            return $.equal(fragment1, [fragment2]).map((node) => node.id);
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

            return $.equal(shadow1, [shadow2]).map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.equal([
                document.querySelector('#parent1 > [data-id="span1"]'),
                document.querySelector('#parent1 > [data-id="span2"]'),
                document.querySelector('#parent1 > [data-id="span3"]'),
            ], '#parent2 span').map((node) => node.dataset.id));

        expect(ids).toEqual([
            'span2',
            'span3',
        ]);
    });

    test('works with HTMLElement other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.equal('#parent1 span', document.querySelector('#parent2 > [data-id="span2"]')).map((node) => node.dataset.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with NodeList other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.equal('#parent1 span', document.querySelectorAll('#parent2 > span')).map((node) => node.dataset.id));

        expect(ids).toEqual([
            'span2',
            'span3',
        ]);
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.equal('#parent1 span', document.getElementById('parent2').children).map((node) => node.dataset.id));

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

            return $.equal([fragment1], fragment2).map((node) => node.id);
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

            return $.equal([shadow1], shadow2).map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });

    test('works with array other nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.equal('#parent1 span', [
                document.querySelector('#parent2 > [data-id="span2"]'),
                document.querySelector('#parent2 > [data-id="span3"]'),
            ]).map((node) => node.dataset.id));

        expect(ids).toEqual([
            'span2',
            'span3',
        ]);
    });
});
