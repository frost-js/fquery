import { setup, wrapAllTests } from '#cases/manipulation/wrap/wrap-all.js';
import { expect, test } from '#test';

test.describe('QuerySet #wrapAll', () => {
    test.beforeEach(setup);

    wrapAllTests(([nodes, ...args]) => {
        $(nodes).wrapAll(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsQuery = await page.evaluate(() => {
            const query = $('a');

            return query === query.wrapAll('.outer');
        });

        expect(returnsQuery).toBe(true);
    });

    test('works with QuerySet other nodes', async ({ page }) => {
        const html = await page.evaluate(() => {
            const query = $('.outer');

            $('a').wrapAll(query);

            return document.body.innerHTML;
        });

        expect(html).toBe('<div id="wrap">' +
            '<div id="parent1">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="parent2">' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '<div class="outer">' +
            '<div class="inner"></div>' +
            '</div>' +
            '</div>');
    });
});
