import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#isVisible', () => {
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
            $.isVisible('div'))).toBe(true);
    });

    test('returns false if no nodes are visible', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isVisible('.test'))).toBe(false);
    });

    test('returns true if any node is a descendent of a visible node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isVisible('span'))).toBe(true);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isVisible(
                document.getElementById('div1'),
            ))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isVisible(
                document.querySelectorAll('div'),
            ))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isVisible(
                document.body.children,
            ))).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isVisible(document))).toBe(true);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isVisible(window))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isVisible([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]))).toBe(true);
    });
});
