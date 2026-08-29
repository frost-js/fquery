import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="div1"></div><div id="div2"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #connected', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns nodes connected to the DOM', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').connected().get().map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div2',
        ]);
    });

    test('filters out nodes not connected to the DOM', async ({ page }) => {
        const nodes = await page.evaluate((_) =>
            $(document.createElement('div')).connected().get());

        expect(nodes).toEqual([]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.connected();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const nodes = await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();

            return $(fragment).connected().get();
        });

        expect(nodes).toEqual([]);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const div = document.getElementById('div1');
            const shadow = div.attachShadow({ mode: 'open' });
            shadow.id = 'shadow';

            return $(shadow).connected().get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });
});
