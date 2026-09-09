import { expect, test } from '#test';

test.describe('QuerySet #getScrollY', () => {
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
            $('div')
                    .getScrollY())).toBe(100);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#invalid')
                    .getScrollY())).toBe(undefined);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="block; width: 1000px; height: 1000px;"></div>';
            document.scrollingElement.scrollTop = 100;
            return $(document)
                    .getScrollY();
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
            return $(doc).getScrollY();
        })).toBe(100);
    });

    test('returns zero for Document nodes without a scrolling element or window', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const doc = document.implementation.createHTMLDocument('');
            doc.removeChild(doc.documentElement);
            return $(doc).getScrollY();
        })).toBe(0);
    });

    test('works with a form document root whose control shadows scrollTop', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const doc = document.implementation.createHTMLDocument('');
            const form = doc.createElement('form');
            form.innerHTML = '<input name="scrollTop">';
            doc.replaceChild(form, doc.documentElement);
            return $(doc).getScrollY();
        })).toBe(0);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="block; width: 1000px; height: 1000px;"></div>';
            window.scrollTo(0, 100);
            return $(window)
                    .getScrollY();
        })).toBe(100);
    });
});
