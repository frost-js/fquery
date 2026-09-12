import { expect, test } from '#test';

test.describe('#selectAll', () => {
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
            $.selectAll('.select');
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            return range.toString();
        })).toBe('Test 2Test 3Test 4');
    });

    test('selects all contents when a node and its descendant are selected', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = document.getElementById('select');
            node.innerHTML = '<span>Test 1</span>Test 2';

            $.selectAll([node, node.firstChild]);
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            return range.toString();
        })).toBe('Test 1Test 2');
    });

    test('selects a range of siblings for getSelection', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.selectAll('.select');
            const selected = $.getSelection();
            return selected.map((node) => node.textContent).join('');
        })).toBe('Test 2Test 3Test 4');
    });

    test('selects text and element siblings for getSelection', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = document.getElementById('select');
            node.innerHTML = 'Test 1<span>Test 2</span>Test 3';

            $.selectAll([node.firstChild, node.lastChild]);
            const selected = $.getSelection();
            return selected.map((node) => node.textContent).join('');
        })).toBe('Test 1Test 2Test 3');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.selectAll(document.getElementById('div3'));
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            return range.toString();
        })).toBe('Test 3');
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.selectAll(document.querySelectorAll('.select'));
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            return range.toString();
        })).toBe('Test 2Test 3Test 4');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.selectAll(document.getElementById('select').children);
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            return range.toString();
        })).toBe('Test 1Test 2Test 3Test 4Test 5');
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.selectAll([
                document.getElementById('div4'),
                document.getElementById('div2'),
            ]);
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            return range.toString();
        })).toBe('Test 2Test 3Test 4');
    });
});
