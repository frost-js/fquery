import { prependTests, setup } from '#cases/manipulation/move/prepend.js';
import { expect, test } from '#test';

test.describe('QuerySet #prepend', () => {
    test.beforeEach(setup);

    prependTests(([nodes, ...args]) => {
        $(nodes).prepend(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsSameQuery = await page.evaluate(() => {
            const query = $('div');

            return query === query.prepend('a');
        });

        expect(returnsSameQuery).toBe(true);
    });

    test.describe('target inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<span></span>');

                $(fragment).prepend('a');
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
                $(shadow).prepend('a');

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

                $(myDoc).prepend(myDoc.createElement('html'));

                return myDoc.childNodes.length;
            });

            expect(childCount).toBe(1);
        });
    });

    test.describe('content inputs', () => {
        test('works with HTMLElement other nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $('div').prepend(document.querySelector('.test1'));

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
                $('div').prepend(document.querySelectorAll('a'));

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
                $('div').prepend(document.getElementById('parent1').children);

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
                $('div').prepend(document.createRange().createContextualFragment('<div><span></span></div>'));

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
                $('div').prepend([
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
                $('div').prepend('<div><span></span></div>');

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

        test('works with QuerySet other nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $('div').prepend($('a'));

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
    });
});
