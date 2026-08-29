import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#isFixed', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: '.test { position: fixed; }' });
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1">' +
                '<span id="span1"></span>' +
                '</div>' +
                '<div id="div2" class="test">' +
                '<span id="span2"></span>' +
                '</div>' +
                '<div id="div3">' +
                '<span id="span3"></span>' +
                '</div>' +
                '<div id="div4" class="test">' +
                '<span id="span4"></span>' +
                '</div>';
        });
    });

    test('returns true if any node is fixed', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isFixed('div'))).toBe(true);
    });

    test('returns false if no nodes are fixed', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isFixed('div:not(.test)'))).toBe(false);
    });

    test('returns true if any node is a descendent of a fixed node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isFixed('span'))).toBe(true);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isFixed(
                document.getElementById('div2'),
            ))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isFixed(
                document.querySelectorAll('div'),
            ))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isFixed(
                document.body.children,
            ))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isFixed([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]))).toBe(true);
    });
});
