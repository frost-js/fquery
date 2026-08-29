import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#select', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="select">' +
                '<div id="div1" class="select">' +
                '<span id="span1">Test 1</span>' +
                '</div>' +
                '<div id="div2" class="select">' +
                '<span id="span2">Test 2</span>' +
                '</div>' +
                '</div>' +
                '<input id="input" value="Test 3">' +
                '<textarea id="textarea">Test 4</textarea>';
        });
    });

    test('creates a selection on the first node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.select('.select');
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            return range.toString();
        })).toBe('Test 1');
    });

    test('creates a selection on an input node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.select('#input');
            document.execCommand('cut');
            return document.getElementById('input').value;
        })).toBe('');
    });

    test('creates a selection on a textarea node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.select('#textarea');
            document.execCommand('cut');
            return document.getElementById('textarea').value;
        })).toBe('');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.select(
                document.getElementById('div1'),
            );
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            return range.toString();
        })).toBe('Test 1');
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.select(
                document.querySelectorAll('.select'),
            );
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            return range.toString();
        })).toBe('Test 1');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.select(
                document.getElementById('select').children,
            );
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            return range.toString();
        })).toBe('Test 1');
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.select([
                document.getElementById('div1'),
                document.getElementById('div2'),
            ]);
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            return range.toString();
        })).toBe('Test 1');
    });
});
