import { setup, wrapSelectionTests } from '#cases/utility/selection/wrap-selection.js';
import { expect, test } from '#test';

test.describe('QuerySet #wrapSelection', () => {
    test.beforeEach(setup);

    wrapSelectionTests(([nodes]) => {
        $(nodes).wrapSelection();
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('.outer');
            return query === query.wrapSelection();
        })).toBe(true);
    });

    test.describe('wrapper inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div class="div-outer"><div class="div-inner"></div></div>',
                );
                $(fragment).wrapSelection();
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
