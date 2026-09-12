import { setup, unwrapTests } from '#cases/manipulation/wrap/unwrap.js';
import { expect, test } from '#test';

test.describe('QuerySet #unwrap', () => {
    test.beforeEach(setup);

    unwrapTests(() => (nodes, ...args) => {
        $(nodes).unwrap(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsQuery = await page.evaluate(() => {
            const query = $('a');

            return query === query.unwrap();
        });

        expect(returnsQuery).toBe(true);
    });

    test.describe('filters', () => {
        test('works with QuerySet filter', async ({ page }) => {
            const html = await page.evaluate(() => {
                const query = $('#parent1');

                $('a').unwrap(query);

                return document.body.innerHTML;
            });

            expect(html).toBe('<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '<div id="parent2">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>');
        });
    });
});
