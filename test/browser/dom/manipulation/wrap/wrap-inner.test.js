import { setup, wrapInnerTests } from '#cases/manipulation/wrap/wrap-inner.js';
import { expect, test } from '#test';

test.describe('#wrapInner', () => {
    test.beforeEach(setup);

    wrapInnerTests((args) => {
        $.wrapInner(...args);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.wrapInner(document.getElementById('parent1'), '.outer');

                return document.body.innerHTML;
            });

            expect(html).toBe('<div id="wrap">' +
                '<div id="parent1">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</div>' +
                '</div>' +
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
                '</div>');
        });

        test('works with NodeList nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.wrapInner(document.querySelectorAll('#wrap > div'), '.outer');

                return document.body.innerHTML;
            });

            expect(html).toBe('<div id="wrap">' +
                '<div id="parent1">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="parent2">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="wrapper">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '</div>' +
                '</div>' +
                '</div>');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.wrapInner(document.getElementById('wrap').children, '.outer');

                return document.body.innerHTML;
            });

            expect(html).toBe('<div id="wrap">' +
                '<div id="parent1">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="parent2">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="wrapper">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '</div>' +
                '</div>' +
                '</div>');
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div><span></span></div>' +
                        '<div><span></span></div>',
                );

                $.wrapInner(fragment, '.outer');
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
                $.wrapInner(shadow, '.outer');

                return shadow.innerHTML;
            });

            expect(html).toBe('<div class="outer">' +
                '<div class="inner">' +
                '<div><span></span></div>' +
                '<div><span></span></div>' +
                '</div>' +
                '</div>');
        });

        test('works with array nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.wrapInner([
                    document.getElementById('parent1'),
                    document.getElementById('parent2'),
                ], '.outer');

                return document.body.innerHTML;
            });

            expect(html).toBe('<div id="wrap">' +
                '<div id="parent1">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="parent2">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>' +
                '</div>' +
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
