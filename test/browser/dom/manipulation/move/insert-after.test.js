import { insertAfterTests, setup } from '#cases/manipulation/move/insert-after.js';
import { expect, test } from '#test';

test.describe('#insertAfter', () => {
    test.beforeEach(setup);

    insertAfterTests((args) => {
        $.insertAfter(...args);
    });

    test.describe('target inputs', () => {
        test('works with HTMLElement other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.insertAfter('a', document.getElementById('parent1'));

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<div id="parent1"><span></span></div>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '<div id="parent2"><span></span></div>',
            );
        });

        test('works with NodeList other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.insertAfter('a', document.querySelectorAll('div'));

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<div id="parent1"><span></span></div>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '<div id="parent2"><span></span></div>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
            );
        });

        test('works with HTMLCollection other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.insertAfter('a', document.body.children);

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<div id="parent1"><span></span></div>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '<div id="parent2"><span></span></div>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
            );
        });

        test('works with array other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.insertAfter('a', [
                    document.getElementById('parent1'),
                    document.getElementById('parent2'),
                ]);

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<div id="parent1"><span></span></div>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '<div id="parent2"><span></span></div>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
            );
        });
    });

    test.describe('content inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.insertAfter(document.querySelector('.test1'), 'div');

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<div id="parent1">' +
                '<span></span>' +
                '<a href="#" class="test2">Test</a>' +
                '</div>' +
                '<a href="#" class="test1">Test</a>' +
                '<div id="parent2">' +
                '<span></span>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '</div>' +
                '<a href="#" class="test1">Test</a>',
            );
        });

        test('works with NodeList nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.insertAfter(document.querySelectorAll('a'), 'div');

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<div id="parent1"><span></span></div>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '<div id="parent2"><span></span></div>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
            );
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.insertAfter(document.getElementById('parent1').children, 'div');

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<div id="parent1"></div>' +
                '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<div id="parent2">' +
                '<span></span>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '</div>' +
                '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>',
            );
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.insertAfter(document.createRange().createContextualFragment('<div><span></span></div>'), 'div');

                return document.body.innerHTML;
            });

            expect(html).toBe(
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
                '</div>' +
                '<div><span></span></div>',
            );
        });

        test('works with array nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.insertAfter([
                    document.querySelector('.test1'),
                    document.querySelector('.test2'),
                    document.querySelector('.test3'),
                    document.querySelector('.test4'),
                ], 'div');

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<div id="parent1"><span></span></div>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '<div id="parent2"><span></span></div>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
            );
        });

        test('works with HTML nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.insertAfter('<div><span></span></div>', 'div');

                return document.body.innerHTML;
            });

            expect(html).toBe(
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
                '</div>' +
                '<div><span></span></div>',
            );
        });
    });
});
