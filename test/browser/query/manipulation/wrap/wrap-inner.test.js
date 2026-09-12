import { setup, wrapInnerTests } from '#cases/manipulation/wrap/wrap-inner.js';
import { expect, test } from '#test';

test.describe('QuerySet #wrapInner', () => {
    test.beforeEach(setup);

    wrapInnerTests(([nodes, ...args]) => {
        $(nodes).wrapInner(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsQuery = await page.evaluate(() => {
            const query = $('#wrap > div');

            return query === query.wrapInner('.outer');
        });

        expect(returnsQuery).toBe(true);
    });

    test.describe('node inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div><span></span></div>' +
                        '<div><span></span></div>',
                );

                $(fragment).wrapInner('.outer');
                document.body.appendChild(fragment);

                return document.body.innerHTML;
            });

            expect(html).toBe('<div id="wrap">' +
                '<div id="parent1">' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</div>' +
                '<div id="parent2">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>' +
                '</div>' +
                '<div id="wrapper">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<div><span></span></div>' +
                '<div><span></span></div>' +
                '</div>' +
                '</div>');
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div><span></span></div>' +
                        '<div><span></span></div>',
                );

                shadow.appendChild(fragment);
                $(shadow).wrapInner('.outer');

                return shadow.innerHTML;
            });

            expect(html).toBe('<div class="outer">' +
                '<div class="inner">' +
                '<div><span></span></div>' +
                '<div><span></span></div>' +
                '</div>' +
                '</div>');
        });
    });
});
