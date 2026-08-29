import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="div1"><span id="span1"></span></div><div id="div2" class="test"><span id="span2"></span></div><div id="div3"><span id="span3"></span></div><div id="div4" class="test"><span id="span4"></span></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #fixed', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: '.test { position: fixed; }' });
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns fixed nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').fixed().get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('returns descendents of fixed nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('span').fixed().get().map((node) => node.id));

        expect(ids).toEqual([
            'span2',
            'span4',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.fixed();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });
});
