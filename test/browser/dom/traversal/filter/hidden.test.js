import { hiddenTests, setup } from '#cases/traversal/filter/hidden.js';
import { expect, test } from '#test';

test.describe('#hidden', () => {
    test.beforeEach(setup);

    hiddenTests((nodes) => $.hidden(nodes).map((node) => node.id));

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.hidden(document.getElementById('div2')).map((node) => node.id));

        expect(ids).toEqual([
            'div2',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.hidden(document.querySelectorAll('div')).map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.hidden(document.body.children).map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const myDoc = new Document();
            myDoc.id = 'document';

            return $.hidden(myDoc).map((node) => node.id);
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

            return $.hidden(myWindow).map((node) => node.id);
        });

        expect(ids).toEqual([
            'window',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.hidden([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });
});
