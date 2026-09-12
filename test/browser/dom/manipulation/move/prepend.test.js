import { prependTests, setup } from '#cases/manipulation/move/prepend.js';
import { expect, test } from '#test';

test.describe('#prepend', () => {
    test.beforeEach(setup);

    prependTests((args) => {
        $.prepend(...args);
    });

    test.describe('target inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $.prepend(document.getElementById('parent1'), 'a');

                return {
                    parent1: document.getElementById('parent1').innerHTML,
                    parent2: document.getElementById('parent2').innerHTML,
                };
            });

            expect(result).toEqual({
                parent1: '<a href="#" class="test1">Test</a>' +
                    '<a href="#" class="test2">Test</a>' +
                    '<a href="#" class="test3">Test</a>' +
                    '<a href="#" class="test4">Test</a>' +
                    '<span></span>',
                parent2: '<span></span>',
            });
        });

        test('works with NodeList nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $.prepend(document.querySelectorAll('div'), 'a');

                return {
                    parent1: document.getElementById('parent1').innerHTML,
                    parent2: document.getElementById('parent2').innerHTML,
                };
            });

            expect(result).toEqual({
                parent1: '<a href="#" class="test1">Test</a>' +
                    '<a href="#" class="test2">Test</a>' +
                    '<a href="#" class="test3">Test</a>' +
                    '<a href="#" class="test4">Test</a>' +
                    '<span></span>',
                parent2: '<a href="#" class="test1">Test</a>' +
                    '<a href="#" class="test2">Test</a>' +
                    '<a href="#" class="test3">Test</a>' +
                    '<a href="#" class="test4">Test</a>' +
                    '<span></span>',
            });
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $.prepend(document.body.children, 'a');

                return {
                    parent1: document.getElementById('parent1').innerHTML,
                    parent2: document.getElementById('parent2').innerHTML,
                };
            });

            expect(result).toEqual({
                parent1: '<a href="#" class="test1">Test</a>' +
                    '<a href="#" class="test2">Test</a>' +
                    '<a href="#" class="test3">Test</a>' +
                    '<a href="#" class="test4">Test</a>' +
                    '<span></span>',
                parent2: '<a href="#" class="test1">Test</a>' +
                    '<a href="#" class="test2">Test</a>' +
                    '<a href="#" class="test3">Test</a>' +
                    '<a href="#" class="test4">Test</a>' +
                    '<span></span>',
            });
        });

        test('works with array nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $.prepend([
                    document.getElementById('parent1'),
                    document.getElementById('parent2'),
                ], 'a');

                return {
                    parent1: document.getElementById('parent1').innerHTML,
                    parent2: document.getElementById('parent2').innerHTML,
                };
            });

            expect(result).toEqual({
                parent1: '<a href="#" class="test1">Test</a>' +
                    '<a href="#" class="test2">Test</a>' +
                    '<a href="#" class="test3">Test</a>' +
                    '<a href="#" class="test4">Test</a>' +
                    '<span></span>',
                parent2: '<a href="#" class="test1">Test</a>' +
                    '<a href="#" class="test2">Test</a>' +
                    '<a href="#" class="test3">Test</a>' +
                    '<a href="#" class="test4">Test</a>' +
                    '<span></span>',
            });
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<span></span>');

                $.prepend(fragment, 'a');
                document.body.appendChild(fragment);

                return document.body.innerHTML;
            });

            expect(html).toBe(
                '<div id="parent1"><span></span></div>' +
                '<div id="parent2"><span></span></div>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '<span></span>',
            );
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const children = await page.evaluate(() => {
                const host = document.createElement('div');
                const shadow = host.attachShadow({ mode: 'open' });

                shadow.appendChild(document.createElement('span'));
                $.prepend(shadow, 'a');

                return [...shadow.children].map((node) => node.outerHTML);
            });

            expect(children).toEqual([
                '<a href="#" class="test1">Test</a>',
                '<a href="#" class="test2">Test</a>',
                '<a href="#" class="test3">Test</a>',
                '<a href="#" class="test4">Test</a>',
                '<span></span>',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            const childCount = await page.evaluate(() => {
                const myDoc = new Document();

                $.prepend(myDoc, myDoc.createElement('html'));

                return myDoc.childNodes.length;
            });

            expect(childCount).toBe(1);
        });
    });

    test.describe('content inputs', () => {
        test('works with HTMLElement other nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $.prepend('div', document.querySelector('.test1'));

                return {
                    parent1: document.getElementById('parent1').innerHTML,
                    parent2: document.getElementById('parent2').innerHTML,
                };
            });

            expect(result).toEqual({
                parent1: '<a href="#" class="test1">Test</a>' +
                    '<span></span>' +
                    '<a href="#" class="test2">Test</a>',
                parent2: '<a href="#" class="test1">Test</a>' +
                    '<span></span>' +
                    '<a href="#" class="test3">Test</a>' +
                    '<a href="#" class="test4">Test</a>',
            });
        });

        test('works with NodeList other nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $.prepend('div', document.querySelectorAll('a'));

                return {
                    parent1: document.getElementById('parent1').innerHTML,
                    parent2: document.getElementById('parent2').innerHTML,
                };
            });

            expect(result).toEqual({
                parent1: '<a href="#" class="test1">Test</a>' +
                    '<a href="#" class="test2">Test</a>' +
                    '<a href="#" class="test3">Test</a>' +
                    '<a href="#" class="test4">Test</a>' +
                    '<span></span>',
                parent2: '<a href="#" class="test1">Test</a>' +
                    '<a href="#" class="test2">Test</a>' +
                    '<a href="#" class="test3">Test</a>' +
                    '<a href="#" class="test4">Test</a>' +
                    '<span></span>',
            });
        });

        test('works with HTMLCollection other nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $.prepend('div', document.getElementById('parent1').children);

                return {
                    parent1: document.getElementById('parent1').innerHTML,
                    parent2: document.getElementById('parent2').innerHTML,
                };
            });

            expect(result).toEqual({
                parent1: '<span></span>' +
                    '<a href="#" class="test1">Test</a>' +
                    '<a href="#" class="test2">Test</a>',
                parent2: '<span></span>' +
                    '<a href="#" class="test1">Test</a>' +
                    '<a href="#" class="test2">Test</a>' +
                    '<span></span>' +
                    '<a href="#" class="test3">Test</a>' +
                    '<a href="#" class="test4">Test</a>',
            });
        });

        test('works with DocumentFragment other nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $.prepend('div', document.createRange().createContextualFragment('<div><span></span></div>'));

                return {
                    parent1: document.getElementById('parent1').innerHTML,
                    parent2: document.getElementById('parent2').innerHTML,
                };
            });

            expect(result).toEqual({
                parent1: '<div><span></span></div>' +
                    '<span></span>' +
                    '<a href="#" class="test1">Test</a>' +
                    '<a href="#" class="test2">Test</a>',
                parent2: '<div><span></span></div>' +
                    '<span></span>' +
                    '<a href="#" class="test3">Test</a>' +
                    '<a href="#" class="test4">Test</a>',
            });
        });

        test('works with array other nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $.prepend('div', [
                    document.querySelector('.test1'),
                    document.querySelector('.test2'),
                    document.querySelector('.test3'),
                    document.querySelector('.test4'),
                ]);

                return {
                    parent1: document.getElementById('parent1').innerHTML,
                    parent2: document.getElementById('parent2').innerHTML,
                };
            });

            expect(result).toEqual({
                parent1: '<a href="#" class="test1">Test</a>' +
                    '<a href="#" class="test2">Test</a>' +
                    '<a href="#" class="test3">Test</a>' +
                    '<a href="#" class="test4">Test</a>' +
                    '<span></span>',
                parent2: '<a href="#" class="test1">Test</a>' +
                    '<a href="#" class="test2">Test</a>' +
                    '<a href="#" class="test3">Test</a>' +
                    '<a href="#" class="test4">Test</a>' +
                    '<span></span>',
            });
        });

        test('works with HTML other nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $.prepend('div', '<div><span></span></div>');

                return {
                    parent1: document.getElementById('parent1').innerHTML,
                    parent2: document.getElementById('parent2').innerHTML,
                };
            });

            expect(result).toEqual({
                parent1: '<div><span></span></div>' +
                    '<span></span>' +
                    '<a href="#" class="test1">Test</a>' +
                    '<a href="#" class="test2">Test</a>',
                parent2: '<div><span></span></div>' +
                    '<span></span>' +
                    '<a href="#" class="test3">Test</a>' +
                    '<a href="#" class="test4">Test</a>',
            });
        });
    });
});
