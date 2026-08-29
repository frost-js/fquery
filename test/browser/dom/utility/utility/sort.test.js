import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#sort', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('returns nodes sorted by the order they appear in the DOM', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.sort('div')
                    .map((node) => node.id))).toEqual([
            'div1',
            'div2',
            'div3',
            'div4',
        ]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.sort(
                document.getElementById('div2'),
            ).map((node) => node.id))).toEqual([
            'div2',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.sort(
                document.querySelectorAll('div'),
            ).map((node) => node.id))).toEqual([
            'div1',
            'div2',
            'div3',
            'div4',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.sort(
                document.body.children,
            ).map((node) => node.id))).toEqual([
            'div1',
            'div2',
            'div3',
            'div4',
        ]);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            fragment.id = 'fragment';
            return $.sort(fragment)
                    .map((node) => node.id);
        })).toEqual([
            'fragment',
        ]);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            shadow.id = 'shadow';
            return $.sort(shadow)
                    .map((node) => node.id);
        })).toEqual([
            'shadow',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.sort(document)
                    .map((node) => node.id))).toEqual([
            'document',
        ]);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.sort(window)
                    .map((node) => node.id))).toEqual([
            'window',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const template = document.createElement('template');
            const fragment = template.content;
            fragment.id = 'fragment';
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            shadow.id = 'shadow';
            document.body.insertBefore(template, document.body.firstChild);
            document.body.insertBefore(div, document.body.firstChild);
            return $.sort([
                fragment,
                document.getElementById('div3'),
                document.getElementById('div4'),
                document.getElementById('div2'),
                document.getElementById('div1'),
                shadow,
                document,
                window,
            ]).map((node) => node.id);
        })).toEqual([
            'fragment',
            'shadow',
            'div1',
            'div2',
            'div3',
            'div4',
            'document',
            'window',
        ]);
    });
});
