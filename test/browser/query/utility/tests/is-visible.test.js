import { expect, test } from '#test';

test.describe('QuerySet #isVisible', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: '.test { display: none; }' });
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1">' +
                '<span></span>' +
                '</div>' +
                '<div id="div2" class="test">' +
                '<span></span>' +
                '</div>' +
                '<div id="div3">' +
                '<span></span>' +
                '</div>' +
                '<div id="div4" class="test">' +
                '<span></span>' +
                '</div>';
        });
    });

    test('returns true if any node is visible', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .isVisible())).toBe(true);
    });

    test('returns false if no nodes are visible', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('.test')
                    .isVisible())).toBe(false);
    });

    test('returns true if any node is a descendent of a visible node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('span')
                    .isVisible())).toBe(true);
    });

    test('returns true for visible fixed nodes', async ({ page }) => {
        await page.addStyleTag({ content: 'div { position: fixed; width: 10px; height: 10px; }' });

        expect(await page.evaluate((_) =>
            $('div:not(.test)')
                    .isVisible())).toBe(true);
    });

    test('returns false for fixed nodes with display none', async ({ page }) => {
        await page.addStyleTag({ content: 'div { position: fixed; width: 10px; height: 10px; }' });

        expect(await page.evaluate((_) =>
            $('.test')
                    .isVisible())).toBe(false);
    });

    test('returns false for fixed descendents of hidden nodes', async ({ page }) => {
        await page.addStyleTag({ content: 'span { position: fixed; width: 10px; height: 10px; }' });

        expect(await page.evaluate((_) =>
            $('.test span')
                    .isVisible())).toBe(false);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(document)
                    .isVisible())).toBe(true);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(window)
                    .isVisible())).toBe(true);
    });
});
