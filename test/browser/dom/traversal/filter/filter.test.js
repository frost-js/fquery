import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="div1"></div><div id="div2" data-filter="test"></div><div id="div3"></div><div id="div4" data-filter="test"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#filter', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns filtered nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.filter('div', '[data-filter="test"]').map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.filter(document.getElementById('div2'), '[data-filter="test"]').map((node) => node.id));

        expect(ids).toEqual([
            'div2',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.filter(document.querySelectorAll('div'), '[data-filter="test"]').map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.filter(document.body.children, '[data-filter="test"]').map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            fragment.id = 'fragment';

            return $.filter(fragment).map((node) => node.id);
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

            return $.filter(shadow).map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.filter([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ], '[data-filter="test"]').map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.filter('div', (node) => node.dataset.filter === 'test').map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.filter('div', document.getElementById('div2')).map((node) => node.id));

        expect(ids).toEqual([
            'div2',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.filter('div', document.querySelectorAll('[data-filter="test"]')).map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.filter('div', document.body.children).map((node) => node.id));

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

            return $.filter([fragment], fragment).map((node) => node.id);
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

            return $.filter([shadow], shadow).map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.filter('div', [
                document.getElementById('div2'),
                document.getElementById('div4'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });
});
