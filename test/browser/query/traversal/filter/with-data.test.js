import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="div1"></div><div id="div2"></div><div id="div3"></div><div id="div4"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #withData', () => {
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
            $('div').withData().get().map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('returns nodes with data for a key', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').withData('test1').get().map((node) => node.id));

        expect(ids).toEqual([
            'div1',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.withData();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();

            $.setData(fragment, 'test', 'Test');
            fragment.id = 'fragment';

            return $(fragment).withData().get().map((node) => node.id);
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

            return $(shadow).withData().get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            $.setData(document, 'test', 'Test');

            return $(document).withData().get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'document',
        ]);
    });

    test('works with Window nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            $.setData(window, 'test', 'Test');

            return $(window).withData().get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'window',
        ]);
    });
});
