import { beforeTests, setup } from '#cases/manipulation/move/before.js';
import { expect, test } from '#test';

test.describe('#before', () => {
    test.beforeEach(setup);

    beforeTests((args) => {
        $.before(...args);
    });

    test.describe('target inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.before(document.getElementById('parent1'), 'a');

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '<div id="parent1"><span></span></div>' +
                '<div id="parent2"><span></span></div>',
            );
        });

        test('works with NodeList nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.before(document.querySelectorAll('div'), 'a');

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

        test('works with HTMLCollection nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.before(document.body.children, 'a');

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

        test('works with array nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.before([
                    document.getElementById('parent1'),
                    document.getElementById('parent2'),
                ], 'a');

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

    test.describe('content inputs', () => {
        test('works with HTMLElement other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.before('div', document.querySelector('.test1'));

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
                $.before('div', document.querySelectorAll('a'));

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
                $.before('div', document.getElementById('parent1').children);

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
                $.before('div', document.createRange().createContextualFragment('<div><span></span></div>'));

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
                $.before('div', [
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
                $.before('div', '<div><span></span></div>');

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
    });
});
