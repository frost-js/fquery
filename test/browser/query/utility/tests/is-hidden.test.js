import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

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
