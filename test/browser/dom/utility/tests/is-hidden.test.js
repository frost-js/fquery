import { isHiddenTests, setup } from '#cases/utility/tests/is-hidden.js';
import { expect, test } from '#test';

test.describe('#isHidden', () => {
    test.beforeEach(setup);

    isHiddenTests((nodes) => $.isHidden(nodes));

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
