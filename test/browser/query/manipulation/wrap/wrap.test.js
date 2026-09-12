import { setup, wrapTests } from '#cases/manipulation/wrap/wrap.js';
import { expect, test } from '#test';

test.describe('QuerySet #wrap', () => {
    test.beforeEach(setup);

    wrapTests(([nodes, ...args]) => {
        $(nodes).wrap(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsQuery = await page.evaluate(() => {
            const query = $('a');

            return query === query.wrap('.outer');
        });

        expect(returnsQuery).toBe(true);
    });

    test('works with QuerySet other nodes', async ({ page }) => {
        const html = await page.evaluate(() => {
            const query = $('.outer');

            $('a').wrap(query);

            return document.body.innerHTML;
        });

        expect(html).toBe('<div id="wrap">' +
            '<div id="parent1">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test1">Test</a>' +
            '</div>' +
            '</div>' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="parent2">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test3">Test</a>' +
            '</div>' +
            '</div>' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test4">Test</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '<div class="outer">' +
            '<div class="inner"></div>' +
            '</div>' +
            '</div>');
    });
});
