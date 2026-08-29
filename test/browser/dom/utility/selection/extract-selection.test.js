import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#extractSelection', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="select">' +
                '<div id="div1">' +
                '<span id="span1">Test 1</span>' +
                '</div>' +
                '<div id="div2">' +
                '<span id="span2">Test 2</span>' +
                '</div>' +
                '</div>';

            const range = document.createRange();
            const div1 = document.getElementById('div1');
            const span2 = document.getElementById('span2');
            range.setStartBefore(div1);
            range.setEnd(span2.firstChild, 3);

            const selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        });
    });

    test('returns the extracted nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const extracted = $.extractSelection();
            document.body.innerHTML = '';
            for (const node of extracted) {
                document.body.appendChild(node);
            }
            return document.body.innerHTML;
        })).toBe('<div id="div1"><span id="span1">Test 1</span></div><div id="div2"><span id="span2">Tes</span></div>');
    });

    test('extracts the selected nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.extractSelection();
            return document.body.innerHTML;
        })).toBe('<div id="select">' +
            '<div id="div2">' +
            '<span id="span2">t 2</span>' +
            '</div>' +
            '</div>');
    });
});
