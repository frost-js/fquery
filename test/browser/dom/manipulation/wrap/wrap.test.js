import { setup, wrapTests } from '#cases/manipulation/wrap/wrap.js';
import { expect, test } from '#test';

test.describe('#wrap', () => {
    test.beforeEach(setup);

    wrapTests((args) => {
        $.wrap(...args);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.wrap(
                    document.getElementById('test1'),
                    '.outer',
                );

                return document.body.innerHTML;
            });

            expect(html).toBe('<div id="wrap">' +
                '<div id="parent1">' +
                '<div class="outer">' +
                '<div class="inner">' +
                '<a href="#" id="test1">Test</a>' +
                '</div>' +
                '</div>' +
                '<a href="#" id="test2">Test</a>' +
                '</div>' +
                '<div id="parent2">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>' +
                '</div>' +
                '<div id="wrapper">' +
                '<div class="outer">' +
                '<div class="inner"></div>' +
                '</div>' +
                '</div>');
        });

        test('works with NodeList nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.wrap(
                    document.querySelectorAll('a'),
                    '.outer',
                );

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

        test('works with HTMLCollection nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.wrap(
                    document.getElementById('parent1').children,
                    '.outer',
                );

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
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>' +
                '</div>' +
                '<div id="wrapper">' +
                '<div class="outer">' +
                '<div class="inner"></div>' +
                '</div>' +
                '</div>');
        });

        test('works with array nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.wrap([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                    document.getElementById('test3'),
                    document.getElementById('test4'),
                ], '.outer');

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
});
