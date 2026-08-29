import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="div1"></div><div id="div2"></div><div id="div3"></div><div id="div4"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#withData', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
        await page.evaluate((_) => {
            $.setData('#div1', 'test1', 'Test 1');
            $.setData('#div3', 'test2', 'Test 2');
        });
    });

    test('returns nodes with data', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withData('div').map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('returns nodes with data for a key', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withData('div', 'test1').map((node) => node.id));

        expect(ids).toEqual([
            'div1',
        ]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withData(document.getElementById('div1')).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withData(document.querySelectorAll('div')).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withData(document.body.children).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            $.setData(fragment, 'test', 'Test');
            fragment.id = 'fragment';

            return $.withData(fragment).map((node) => node.id);
        });

        expect(ids).toEqual([
            'fragment',
        ]);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.setData(shadow, 'test', 'Test');
            shadow.id = 'shadow';

            return $.withData(shadow).map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            $.setData(document, 'test', 'Test');

            return $.withData(document).map((node) => node.id);
        });

        expect(ids).toEqual([
            'document',
        ]);
    });

    test('works with Window nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            $.setData(window, 'test', 'Test');

            return $.withData(window).map((node) => node.id);
        });

        expect(ids).toEqual([
            'window',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withData([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });
});
