import { beforeTests, setup } from '#cases/manipulation/move/before.js';
import { expect, test } from '#test';

test.describe('QuerySet #before', () => {
    test.beforeEach(setup);

    beforeTests(([nodes, ...args]) => {
        $(nodes).before(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsSameQuery = await page.evaluate(() => {
            const query = $('div');

            return query === query.before('a');
        });

        expect(returnsSameQuery).toBe(true);
    });

    test.describe('content inputs', () => {
        test('works with HTMLElement other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $('div').before(document.querySelector('.test1'));

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<a href="#" class="test1">Test</a>' +
                '<div id="parent1">' +
                '<span></span>' +
                '<a href="#" class="test2">Test</a>' +
                '</div>' +
                '<a href="#" class="test1">Test</a>' +
                '<div id="parent2">' +
                '<span></span>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '</div>',
            );
        });

        test('works with NodeList other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $('div').before(document.querySelectorAll('a'));

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '<div id="parent1"><span></span></div>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '<div id="parent2"><span></span></div>',
            );
        });

        test('works with HTMLCollection other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $('div').before(document.getElementById('parent1').children);

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<div id="parent1"></div>' +
                '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<div id="parent2">' +
                '<span></span>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '</div>',
            );
        });

        test('works with DocumentFragment other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $('div').before(document.createRange().createContextualFragment('<div><span></span></div>'));

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<div><span></span></div>' +
                '<div id="parent1">' +
                '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '</div>' +
                '<div><span></span></div>' +
                '<div id="parent2">' +
                '<span></span>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '</div>',
            );
        });

        test('works with array other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $('div').before([
                    document.querySelector('.test1'),
                    document.querySelector('.test2'),
                    document.querySelector('.test3'),
                    document.querySelector('.test4'),
                ]);

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '<div id="parent1"><span></span></div>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '<div id="parent2"><span></span></div>',
            );
        });

        test('works with HTML other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $('div').before('<div><span></span></div>');

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<div><span></span></div>' +
                '<div id="parent1">' +
                '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '</div>' +
                '<div><span></span></div>' +
                '<div id="parent2">' +
                '<span></span>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '</div>',
            );
        });

        test('works with QuerySet other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $('div').before($('a'));

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '<div id="parent1"><span></span></div>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '<div id="parent2"><span></span></div>',
            );
        });
    });
});
