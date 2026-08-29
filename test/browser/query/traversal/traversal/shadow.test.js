import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="div1"></div><div id="div2"></div><div id="div3"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #shadow', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);

        await page.evaluate((_) => {
            document.getElementById('div1').attachShadow({ mode: 'open' });
            document.getElementById('div2').attachShadow({ mode: 'closed' });
        });
    });

    test('returns the shadow root of the first node', async ({ page }) => {
        const hasShadow = await page.evaluate((_) => {
            const query = $('div');
            const shadow = query.shadow();

            return shadow.length === 1 && shadow.get(0) instanceof ShadowRoot;
        });

        expect(hasShadow).toBe(true);
    });

    test('returns an empty QuerySet for closed shadow roots', async ({ page }) => {
        const isEmpty = await page.evaluate((_) => {
            const query = $('#div2');
            const shadow = query.shadow();

            return shadow.length === 0;
        });

        expect(isEmpty).toBe(true);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.shadow();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });
});
