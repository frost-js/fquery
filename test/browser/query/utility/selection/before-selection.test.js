import { beforeSelectionTests, setup } from '#cases/utility/selection/before-selection.js';
import { expect, test } from '#test';

test.describe('QuerySet #beforeSelection', () => {
    test.beforeEach(setup);

    beforeSelectionTests(([nodes]) => {
        $(nodes).beforeSelection();
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query = $('a');
            return query === query.beforeSelection();
        })).toBe(true);
    });

    test.describe('inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div><span></span></div>',
                );
                $(fragment).beforeSelection();
                return document.body.innerHTML;
            })).toBe('<div id="select">' +
                '<div id="div1">' +
                '<span id="span1">Tes' +
                '<div><span></span></div>' +
                't 1</span>' +
                '</div>' +
                '<div id="div2">' +
                '<span id="span2">Test 2</span>' +
                '</div>' +
                '</div>' +
                '<div id="parent">' +
                '<a href="#" id="a1">Test</a>' +
                '<a href="#" id="a2">Test</a>' +
                '</div>');
        });
    });
});
