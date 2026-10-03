import { hiddenTests, setup } from '#cases/traversal/filter/hidden.js';
import { expect, test } from '#test';

test.describe('QuerySet #hidden', () => {
    test.beforeEach(setup);

    hiddenTests((nodes) => $(nodes).hidden().get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const query1 = $('div');
            const query2 = query1.hidden();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate(() => {
            const myDoc = new Document();
            myDoc.id = 'document';

            return $(myDoc).hidden().get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'document',
        ]);
    });

    test('works with Window nodes', async ({ page }) => {
        const ids = await page.evaluate(() => {
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
