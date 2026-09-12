import { afterTests, setup } from '#cases/manipulation/move/after.js';
import { expect, test } from '#test';

test.describe('#after', () => {
    test.beforeEach(setup);

    afterTests((args) => {
        $.after(...args);
    });

    test.describe('target inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.after(document.getElementById('parent1'), 'a');

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

        test('works with NodeList nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.after(document.querySelectorAll('div'), 'a');

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
                $.after(document.body.children, 'a');

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

        test('works with array nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.after([
                    document.getElementById('parent1'),
                    document.getElementById('parent2'),
                ], 'a');

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
        test('works with HTMLElement other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.after('div', document.querySelector('.test1'));

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

        test('works with NodeList other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.after('div', document.querySelectorAll('a'));

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
                $.after('div', document.getElementById('parent1').children);

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

        test('works with DocumentFragment other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.after('div', document.createRange().createContextualFragment('<div><span></span></div>'));

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

        test('works with array other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.after('div', [
                    document.querySelector('.test1'),
                    document.querySelector('.test2'),
                    document.querySelector('.test3'),
                    document.querySelector('.test4'),
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

        test('works with HTML other nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.after('div', '<div><span></span></div>');

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
