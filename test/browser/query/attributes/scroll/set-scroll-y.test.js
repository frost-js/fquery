import { expect, test } from '#test';

test.describe('QuerySet #setScrollY', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; width: 1px; height: 100px; overflow: scroll;">' +
                '<div style="display: block; width: 1px; height: 1000px;"></div>' +
                '</div>' +
                '<div id="test2" style="display: block; width: 1px; height: 100px; overflow: scroll;">' +
                '<div style="display: block; width: 1px; height: 1000px;"></div>' +
                '</div>';
        });
    });

    test('sets the scroll Y position for all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('div').setScrollY(100);
            return [
                document.getElementById('test1').scrollTop,
                document.getElementById('test2').scrollTop,
            ];
        })).toEqual([
            100,
            100,
        ]);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.setScrollY(100);
        })).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $(document).setScrollY(100);
            return document.scrollingElement.scrollTop;
        })).toBe(100);
    });

    test('works with Document nodes without a scrolling element and preserves the X position', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            const doc = iframe.contentDocument;
            doc.open();
            doc.write('<html style="overflow: auto;"><body style="overflow: auto; width: 1000px; height: 1000px;"></body></html>');
            doc.close();
            doc.defaultView.scrollTo(50, 0);
            $(doc).setScrollY(100);
            return [
                doc.defaultView.scrollX,
                doc.defaultView.scrollY,
            ];
        })).toEqual([50, 100]);
    });

    test('skips Document nodes without a scrolling element or window', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const doc = document.implementation.createHTMLDocument('');
            doc.removeChild(doc.documentElement);
            const element = document.getElementById('test1');
            $([doc, element]).setScrollY(100);
            return element.scrollTop;
        })).toBe(100);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $(window).setScrollY(100);
            return window.scrollY;
        })).toBe(100);
    });
});
