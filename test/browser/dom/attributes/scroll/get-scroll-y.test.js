import { expect, test } from '#test';

test.describe('#getScrollY', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; height: 100px; overflow-y: scroll;">' +
                '<div style="display: block; width: 1px; height: 1000px;"></div>' +
                '</div>' +
                '<div id="test2"></div>';
            document.getElementById('test1').scrollTop = 100;
        });
    });

    test('returns the scroll Y position of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getScrollY('div'))).toBe(100);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getScrollY('#invalid'))).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getScrollY(
                document.getElementById('test1'),
            ))).toBe(100);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getScrollY(
                document.querySelectorAll('div'),
            ))).toBe(100);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getScrollY(
                document.body.children,
            ))).toBe(100);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="block; width: 1000px; height: 1000px;"></div>';
            document.scrollingElement.scrollTop = 100;
            return $.getScrollY(document);
        })).toBe(100);
    });

    test('works with Document nodes without a scrolling element', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            const doc = iframe.contentDocument;
            doc.open();
            doc.write('<html style="overflow: auto;"><body style="overflow: auto; width: 1000px; height: 1000px;"></body></html>');
            doc.close();
            doc.defaultView.scrollTo(0, 100);
            return $.getScrollY(doc);
        })).toBe(100);
    });

    test('returns zero for Document nodes without a scrolling element or window', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const doc = document.implementation.createHTMLDocument('');
            doc.removeChild(doc.documentElement);
            return $.getScrollY(doc);
        })).toBe(0);
    });

    test('works with a form document root whose control shadows scrollTop', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const doc = document.implementation.createHTMLDocument('');
            const form = doc.createElement('form');
            form.innerHTML = '<input name="scrollTop">';
            doc.replaceChild(form, doc.documentElement);
            return $.getScrollY(doc);
        })).toBe(0);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="block; width: 1000px; height: 1000px;"></div>';
            window.scrollTo(0, 100);
            return $.getScrollY(window);
        })).toBe(100);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getScrollY([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]))).toBe(100);
    });
});
