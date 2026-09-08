import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #selectAll', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="select">' +
                '<div id="div1">' +
                '<span id="span1">Test 1</span>' +
                '</div>' +
                '<div id="div2" class="select">' +
                '<span id="span2">Test 2</span>' +
                '</div>' +
                '<div id="div3">' +
                '<span id="span3">Test 3</span>' +
                '</div>' +
                '<div id="div4" class="select">' +
                '<span id="span4">Test 4</span>' +
                '</div>' +
                '<div id="div5">' +
                '<span id="span5">Test 5</span>' +
                '</div>' +
                '</div>';
        });
    });

    test('creates a selection on all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('.select').selectAll();
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            return range.toString();
        })).toBe('Test 2Test 3Test 4');
    });

    test('selects all contents when a node and its descendant are selected', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = document.getElementById('select');
            node.innerHTML = '<span>Test 1</span>Test 2';

            $([node, node.firstChild]).selectAll();
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            return range.toString();
        })).toBe('Test 1Test 2');
    });

    test('selects a range of siblings for getSelection', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('.select').selectAll();
            const selected = $.getSelection();
            return selected.map((node) => node.textContent).join('');
        })).toBe('Test 2Test 3Test 4');
    });

    test('selects text and element siblings for getSelection', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = document.getElementById('select');
            node.innerHTML = 'Test 1<span>Test 2</span>Test 3';

            $([node.firstChild, node.lastChild]).selectAll();
            const selected = $.getSelection();
            return selected.map((node) => node.textContent).join('');
        })).toBe('Test 1Test 2Test 3');
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('.select');
            return query === query.selectAll();
        })).toBe(true);
    });
});
