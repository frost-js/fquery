import { expect, test } from '#test';

test.describe('QuerySet #setScrollX', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; width: 100px; height: 1px; overflow: scroll;">' +
                '<div style="display: block; width: 1000px; height: 1px;"></div>' +
                '</div>' +
                '<div id="test2" style="display: block; width: 100px; height: 1px; overflow: scroll;">' +
                '<div style="display: block; width: 1000px; height: 1px;"></div>' +
                '</div>';
        });
    });

    test('sets the scroll X position for all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('div').setScrollX(100);
            return [
                document.getElementById('test1').scrollLeft,
                document.getElementById('test2').scrollLeft,
            ];
        })).toEqual([
            100,
            100,
        ]);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.setScrollX(100);
        })).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $(document).setScrollX(100);
            return document.scrollingElement.scrollLeft;
        })).toBe(100);
    });

    test('works with Document nodes without a scrolling element and preserves the Y position', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            const doc = iframe.contentDocument;
            doc.open();
            doc.write('<html style="overflow: auto;"><body style="overflow: auto; width: 1000px; height: 1000px;"></body></html>');
            doc.close();
            doc.defaultView.scrollTo(0, 50);
            $(doc).setScrollX(100);
            return [
                doc.defaultView.scrollX,
                doc.defaultView.scrollY,
            ];
        })).toEqual([100, 50]);
    });

    test('skips Document nodes without a scrolling element or window', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const doc = document.implementation.createHTMLDocument('');
            doc.removeChild(doc.documentElement);
            const element = document.getElementById('test1');
            $([doc, element]).setScrollX(100);
            return element.scrollLeft;
        })).toBe(100);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $(window).setScrollX(100);
            return window.scrollX;
        })).toBe(100);
    });
});
