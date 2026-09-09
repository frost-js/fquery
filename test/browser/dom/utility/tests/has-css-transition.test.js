import { expect, test } from '#test';

test.describe('#hasCSSTransition', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: '.test { transition: opacity 1s; }' });
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1" class="test"></div>' +
                '<div id="div2></div>' +
                '<div id="div3" class="test"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('returns true if any node has a CSS transition', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasCSSTransition('div'))).toBe(true);
    });

    test('returns true if a later CSS transition duration is nonzero', async ({ page }) => {
        await page.addStyleTag({ content: '.test { transition: opacity 0s, transform 1s; }' });

        expect(await page.evaluate((_) =>
            $.hasCSSTransition('div'))).toBe(true);
    });

    test('returns false if all CSS transition durations are zero', async ({ page }) => {
        await page.addStyleTag({ content: '.test { transition: opacity 0s, transform 0s; }' });

        expect(await page.evaluate((_) =>
            $.hasCSSTransition('div'))).toBe(false);
    });

    test('returns false if no nodes have a CSS transition', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasCSSTransition('div:not(.test)'))).toBe(false);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasCSSTransition(
                document.getElementById('div1'),
            ))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasCSSTransition(
                document.querySelectorAll('div'),
            ))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasCSSTransition(
                document.body.children,
            ))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasCSSTransition([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]))).toBe(true);
    });
});
