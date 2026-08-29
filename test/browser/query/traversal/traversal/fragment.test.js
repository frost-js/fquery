import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<template id="template1"></template><template id="template2"></template><div id="div1"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #fragment', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the document fragment of the first node', async ({ page }) => {
        const hasFragment = await page.evaluate((_) => {
            const query = $('template');
            const fragment = query.fragment();

            return fragment.length === 1 && fragment.get(0) instanceof DocumentFragment;
        });

        expect(hasFragment).toBe(true);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('template');
            const query2 = query1.fragment();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });
});
