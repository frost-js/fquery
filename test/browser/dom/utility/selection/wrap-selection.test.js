import { setup, wrapSelectionTests } from '#cases/utility/selection/wrap-selection.js';
import { expect, test } from '#test';

test.describe('#wrapSelection', () => {
    test.beforeEach(setup);

    wrapSelectionTests((args) => {
        $.wrapSelection(...args);
    });

    test.describe('wrapper inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.wrapSelection(document.querySelector('.outer'));
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
                $.wrapSelection(document.querySelectorAll('.outer'));
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
                $.wrapSelection(document.getElementById('wrapper').children);
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
                $.wrapSelection([document.querySelector('.outer')]);
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
});
