import { expect, test } from '#test';

test.describe('QuerySet #isHidden', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: '.test { display: none; }' });
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1" class="test">' +
                '<span></span>' +
                '</div>' +
                '<div id="div2">' +
                '<span></span>' +
                '</div>' +
                '<div id="div3" class="test">' +
                '<span></span>' +
                '</div>' +
                '<div id="div4">' +
                '<span></span>' +
                '</div>';
        });
    });

    test('returns true if any node is hidden', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .isHidden())).toBe(true);
    });

    test('returns false if no nodes are hidden', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div:not(.test)')
                    .isHidden())).toBe(false);
    });

    test('returns true if any node is a descendent of a hidden node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('span')
                    .isHidden())).toBe(true);
    });

    test('returns false for visible fixed nodes', async ({ page }) => {
        await page.addStyleTag({ content: 'div { position: fixed; width: 10px; height: 10px; }' });

        expect(await page.evaluate((_) =>
            $('div:not(.test)')
                    .isHidden())).toBe(false);
    });

    test('returns true for fixed nodes with display none', async ({ page }) => {
        await page.addStyleTag({ content: 'div { position: fixed; width: 10px; height: 10px; }' });

        expect(await page.evaluate((_) =>
            $('.test')
                    .isHidden())).toBe(true);
    });

    test('returns true for fixed descendents of hidden nodes', async ({ page }) => {
        await page.addStyleTag({ content: 'span { position: fixed; width: 10px; height: 10px; }' });

        expect(await page.evaluate((_) =>
            $('.test span')
                    .isHidden())).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = new Document();
            return $(myDoc)
                    .isHidden();
        })).toBe(true);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myWindow = {
                document: {},
                id: 'window',
            };
            myWindow.document.defaultView = myWindow;
            return $(myWindow)
                    .isHidden();
        })).toBe(true);
    });
});
