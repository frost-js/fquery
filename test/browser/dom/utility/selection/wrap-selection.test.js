import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#wrapSelection', () => {
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
                '</div>' +
                '<div id="wrapper">' +
                '<div class="outer">' +
                '<div class="inner"></div>' +
                '</div>' +
                '</div>';

            const range = document.createRange();
            const span1 = document.getElementById('span1');
            const span2 = document.getElementById('span2');
            range.setStart(span1.firstChild, 3);
            range.setEnd(span2.firstChild, 3);

            const selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        });
    });

    test('wraps selected nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.wrapSelection('.outer');
            return document.body.innerHTML;
        })).toBe('<div id="select">' +
            '<div id="div1">' +
            '<span id="span1">Tes</span>' +
            '</div>' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<div id="div1">' +
            '<span id="span1">t 1</span>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">Tes</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">t 2</span>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '</div>');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.wrapSelection(
                document.querySelector('.outer'),
            );
            return document.body.innerHTML;
        })).toBe('<div id="select">' +
            '<div id="div1">' +
            '<span id="span1">Tes</span>' +
            '</div>' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<div id="div1">' +
            '<span id="span1">t 1</span>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">Tes</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">t 2</span>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '</div>');
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.wrapSelection(
                document.querySelectorAll('.outer'),
            );
            return document.body.innerHTML;
        })).toBe('<div id="select">' +
            '<div id="div1">' +
            '<span id="span1">Tes</span>' +
            '</div>' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<div id="div1">' +
            '<span id="span1">t 1</span>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">Tes</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">t 2</span>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '</div>');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.wrapSelection(
                document.getElementById('wrapper').children,
            );
            return document.body.innerHTML;
        })).toBe('<div id="select">' +
            '<div id="div1">' +
            '<span id="span1">Tes</span>' +
            '</div>' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<div id="div1">' +
            '<span id="span1">t 1</span>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">Tes</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">t 2</span>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '</div>');
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div class="div-outer"><div class="div-inner"></div></div>',
            );
            $.wrapSelection(fragment);
            return document.body.innerHTML;
        })).toBe('<div id="select">' +
            '<div id="div1">' +
            '<span id="span1">Tes</span>' +
            '</div>' +
            '<div class="div-outer">' +
            '<div class="div-inner">' +
            '<div id="div1">' +
            '<span id="span1">t 1</span>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">Tes</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">t 2</span>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '</div>' +
            '</div>' +
            '</div>');
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.wrapSelection([
                document.querySelector('.outer'),
            ]);
            return document.body.innerHTML;
        })).toBe('<div id="select">' +
            '<div id="div1">' +
            '<span id="span1">Tes</span>' +
            '</div>' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<div id="div1">' +
            '<span id="span1">t 1</span>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">Tes</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">t 2</span>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '</div>');
    });

    test('works with HTML nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.wrapSelection('<div class="div-outer"><div class="div-inner"></div></div>');
            return document.body.innerHTML;
        })).toBe('<div id="select">' +
            '<div id="div1">' +
            '<span id="span1">Tes</span>' +
            '</div>' +
            '<div class="div-outer">' +
            '<div class="div-inner">' +
            '<div id="div1">' +
            '<span id="span1">t 1</span>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">Tes</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="div2">' +
            '<span id="span2">t 2</span>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '</div>' +
            '</div>' +
            '</div>');
    });
});
