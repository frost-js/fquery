import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

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

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.selectAll(
                document.getElementById('div3'),
            );
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            return range.toString();
        })).toBe('Test 3');
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.selectAll(
                document.querySelectorAll('.select'),
            );
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            return range.toString();
        })).toBe('Test 2Test 3Test 4');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.selectAll(
                document.getElementById('select').children,
            );
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
