import { afterSelectionTests, setup } from '#cases/utility/selection/after-selection.js';
import { expect, test } from '#test';

test.describe('#afterSelection', () => {
    test.beforeEach(setup);

    afterSelectionTests((args) => {
        $.afterSelection(...args);
    });

    test.describe('inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.afterSelection(document.getElementById('a1'));
                return document.body.innerHTML;
            })).toBe('<div id="select">' +
                '<div id="div1">' +
                '<span id="span1">Test 1</span>' +
                '</div>' +
                '<div id="div2">' +
                '<span id="span2">Tes' +
                '<a href="#" id="a1">Test</a>' +
                't 2</span>' +
                '</div>' +
                '</div>' +
                '<div id="parent">' +
                '<a href="#" id="a2">Test</a>' +
                '</div>');
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.afterSelection(document.querySelectorAll('a'));
                return document.body.innerHTML;
            })).toBe('<div id="select">' +
                '<div id="div1">' +
                '<span id="span1">Test 1</span>' +
                '</div>' +
                '<div id="div2">' +
                '<span id="span2">Tes' +
                '<a href="#" id="a1">Test</a>' +
                '<a href="#" id="a2">Test</a>' +
                't 2</span>' +
                '</div>' +
                '</div>' +
                '<div id="parent"></div>');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.afterSelection(document.getElementById('parent').children);
                return document.body.innerHTML;
            })).toBe('<div id="select">' +
                '<div id="div1">' +
                '<span id="span1">Test 1</span>' +
                '</div>' +
                '<div id="div2">' +
                '<span id="span2">Tes' +
                '<a href="#" id="a1">Test</a>' +
                '<a href="#" id="a2">Test</a>' +
                't 2</span>' +
                '</div>' +
                '</div>' +
                '<div id="parent"></div>');
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div><span></span></div>',
                );
                $.afterSelection(fragment);
                return document.body.innerHTML;
            })).toBe('<div id="select">' +
                '<div id="div1">' +
                '<span id="span1">Test 1</span>' +
                '</div>' +
                '<div id="div2">' +
                '<span id="span2">Tes' +
                '<div><span></span></div>' +
                't 2</span>' +
                '</div>' +
                '</div>' +
                '<div id="parent">' +
                '<a href="#" id="a1">Test</a>' +
                '<a href="#" id="a2">Test</a>' +
                '</div>');
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.afterSelection([
                    document.getElementById('a1'),
                    document.getElementById('a2'),
                ]);
                return document.body.innerHTML;
            })).toBe('<div id="select">' +
                '<div id="div1">' +
                '<span id="span1">Test 1</span>' +
                '</div>' +
                '<div id="div2">' +
                '<span id="span2">Tes' +
                '<a href="#" id="a1">Test</a>' +
                '<a href="#" id="a2">Test</a>' +
                't 2</span>' +
                '</div>' +
                '</div>' +
                '<div id="parent"></div>');
        });

        test('works with HTML nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.afterSelection('<div><span></span></div>');
                return document.body.innerHTML;
            })).toBe('<div id="select">' +
                '<div id="div1">' +
                '<span id="span1">Test 1</span>' +
                '</div>' +
                '<div id="div2">' +
                '<span id="span2">Tes' +
                '<div><span></span></div>' +
                't 2</span>' +
                '</div>' +
                '</div>' +
                '<div id="parent">' +
                '<a href="#" id="a1">Test</a>' +
                '<a href="#" id="a2">Test</a>' +
                '</div>');
        });
    });
});
