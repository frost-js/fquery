import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#isHidden', () => {
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
            $.isHidden('div'))).toBe(true);
    });

    test('returns false if no nodes are hidden', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isHidden('div:not(.test)'))).toBe(false);
    });

    test('returns true if any node is a descendent of a hidden node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isHidden('span'))).toBe(true);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isHidden(
                document.getElementById('div1'),
            ))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isHidden(
                document.querySelectorAll('div'),
            ))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isHidden(
                document.body.children,
            ))).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = new Document();
            return $.isHidden(myDoc);
        })).toBe(true);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myWindow = {
                document: {},
                id: 'window',
            };
            myWindow.document.defaultView = myWindow;
            return $.isHidden(myWindow);
        })).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isHidden([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]))).toBe(true);
    });
});
