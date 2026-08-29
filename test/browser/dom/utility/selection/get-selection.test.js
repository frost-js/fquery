import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#getSelection', () => {
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
            const span2 = document.getElementById('span2');
            range.setStartBefore(span2);
            range.setEnd(span2.firstChild, 3);

            const selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        });
    });

    test('returns the selected nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const selected = $.getSelection();
            document.body.innerHTML = '';
            for (const node of selected) {
                document.body.appendChild(node);
            }
            return document.body.innerHTML;
        })).toBe('<span id="span2">Test 2</span>');
    });

    test('returns a selection contained in a text node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = document.getElementById('span1').firstChild;
            const range = document.createRange();
            range.setStart(node, 1);
            range.setEnd(node, 3);

            const selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            const selected = $.getSelection();

            return [selected.length, selected[0].nodeType, selected[0].textContent];
        })).toEqual([1, 3, 'Test 1']);
    });

    test('does not extract the selected nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.getSelection();
            return document.body.innerHTML;
        })).toBe('<div id="select">' +
            '<div id="div1">' +
            '<span id="span1">Test 1</span>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">Test 2</span>' +
            '</div>' +
            '</div>');
    });
});
