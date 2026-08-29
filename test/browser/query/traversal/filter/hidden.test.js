import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="div1"><span id="span1"></span></div><div id="div2" class="test"><span id="span2"></span></div><div id="div3"><span id="span3"></span></div><div id="div4" class="test"><span id="span4"></span></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #hidden', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: '.test { display: none; }' });
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns hidden nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').hidden().get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('returns descendents of hidden nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('span').hidden().get().map((node) => node.id));

        expect(ids).toEqual([
            'span2',
            'span4',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.hidden();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const myDoc = new Document();
            myDoc.id = 'document';

            return $(myDoc).hidden().get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'document',
        ]);
    });

    test('works with Window nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const myWindow = {
                document: {},
                id: 'window',
            };
            myWindow.document.defaultView = myWindow;

            return $(myWindow).hidden().get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'window',
        ]);
    });
});
