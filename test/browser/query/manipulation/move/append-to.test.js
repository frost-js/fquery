import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const MOVE_HTML =
    '<div id="parent1">' +
    '<a href="#" class="test1">Test</a>' +
    '<a href="#" class="test2">Test</a>' +
    '<span></span>' +
    '</div>' +
    '<div id="parent2">' +
    '<a href="#" class="test3">Test</a>' +
    '<a href="#" class="test4">Test</a>' +
    '<span></span>' +
    '</div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #appendTo', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, MOVE_HTML);
    });

    test('appends each node to each other node', async ({ page }) => {
        const result = await page.evaluate(() => {
            $('a').appendTo('div');

            return {
                parent1: document.getElementById('parent1').innerHTML,
                parent2: document.getElementById('parent2').innerHTML,
            };
        });

        expect(result).toEqual({
            parent1: '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
            parent2: '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
        });
    });

    test('preserves events for nodes', async ({ page }) => {
        const clickCount = await page.evaluate(() => {
            let count = 0;

            $.addEvent('a', 'click', () => {
                count++;
            });

            $('a').appendTo('div');
            $.triggerEvent('a', 'click');

            return count;
        });

        expect(clickCount).toBe(8);
    });

    test('preserves data for nodes', async ({ page }) => {
        const values = await page.evaluate(() => {
            $.setData('a', 'test', 'Test');
            $('a').appendTo('div');

            return [...document.querySelectorAll('a')].map((node) => $.getData(node, 'test'));
        });

        expect(values).toEqual([
            'Test',
            'Test',
            'Test',
            'Test',
            'Test',
            'Test',
            'Test',
            'Test',
        ]);
    });

    test('preserves animations for nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.animate(
                'a',
                () => {},
                {
                    duration: 100,
                    debug: true,
                },
            );

            $('a').appendTo('div');
        });

        await expect.poll(async () => await page.evaluate(() => {
            const nodes = [...document.querySelectorAll('#parent1 > a, #parent2 > a')];

            return nodes.length === 8 &&
                nodes.every((node) => Boolean(node.dataset.animationProgress));
        })).toBe(true);

        await expect.poll(async () => await page.evaluate(() =>
            [...document.querySelectorAll('#parent1 > a, #parent2 > a')].every((node) =>
                !node.dataset.animationProgress &&
                !node.dataset.animationStart &&
                !node.dataset.animationTime),
        )).toBe(true);
    });

    test('does not clone for the last nodes', async ({ page }) => {
        const isSameNode = await page.evaluate(() => {
            const nodes = [...document.querySelectorAll('a')];

            $('a').appendTo('div');

            return nodes.every((node, index) => node.isSameNode(document.querySelectorAll('a').item(index + 4)));
        });

        expect(isSameNode).toBe(true);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsSameQuery = await page.evaluate(() => {
            const query = $('a');

            return query === query.appendTo('div');
        });

        expect(returnsSameQuery).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const result = await page.evaluate(() => {
            $(document.createRange().createContextualFragment('<div><span></span></div>')).appendTo('div');

            return {
                parent1: document.getElementById('parent1').innerHTML,
                parent2: document.getElementById('parent2').innerHTML,
            };
        });

        expect(result).toEqual({
            parent1: '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<span></span>' +
                '<div><span></span></div>',
            parent2: '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>' +
                '<span></span>' +
                '<div><span></span></div>',
        });
    });

    test('works with HTMLElement other nodes', async ({ page }) => {
        const result = await page.evaluate(() => {
            $('a').appendTo(document.getElementById('parent1'));

            return {
                parent1: document.getElementById('parent1').innerHTML,
                parent2: document.getElementById('parent2').innerHTML,
            };
        });

        expect(result).toEqual({
            parent1: '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
            parent2: '<span></span>',
        });
    });

    test('works with NodeList other nodes', async ({ page }) => {
        const result = await page.evaluate(() => {
            $('a').appendTo(document.querySelectorAll('div'));

            return {
                parent1: document.getElementById('parent1').innerHTML,
                parent2: document.getElementById('parent2').innerHTML,
            };
        });

        expect(result).toEqual({
            parent1: '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
            parent2: '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
        });
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        const result = await page.evaluate(() => {
            $('a').appendTo(document.body.children);

            return {
                parent1: document.getElementById('parent1').innerHTML,
                parent2: document.getElementById('parent2').innerHTML,
            };
        });

        expect(result).toEqual({
            parent1: '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
            parent2: '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
        });
    });

    test('works with DocumentFragment other nodes', async ({ page }) => {
        const html = await page.evaluate(() => {
            const fragment = document.createRange().createContextualFragment('<span></span>');

            $('a').appendTo(fragment);
            document.body.appendChild(fragment);

            return document.body.innerHTML;
        });

        expect(html).toBe(
            '<div id="parent1"><span></span></div>' +
            '<div id="parent2"><span></span></div>' +
            '<span></span>' +
            '<a href="#" class="test1">Test</a>' +
            '<a href="#" class="test2">Test</a>' +
            '<a href="#" class="test3">Test</a>' +
            '<a href="#" class="test4">Test</a>',
        );
    });

    test('works with ShadowRoot other nodes', async ({ page }) => {
        const children = await page.evaluate(() => {
            const host = document.createElement('div');
            const shadow = host.attachShadow({ mode: 'open' });

            shadow.appendChild(document.createElement('span'));
            $('a').appendTo(shadow);

            return [...shadow.children].map((node) => node.outerHTML);
        });

        expect(children).toEqual([
            '<span></span>',
            '<a href="#" class="test1">Test</a>',
            '<a href="#" class="test2">Test</a>',
            '<a href="#" class="test3">Test</a>',
            '<a href="#" class="test4">Test</a>',
        ]);
    });

    test('works with Document other nodes', async ({ page }) => {
        const childCount = await page.evaluate(() => {
            const myDoc = new Document();

            $(myDoc.createElement('html')).appendTo(myDoc);

            return myDoc.childNodes.length;
        });

        expect(childCount).toBe(1);
    });

    test('works with array other nodes', async ({ page }) => {
        const result = await page.evaluate(() => {
            $('a').appendTo([
                document.getElementById('parent1'),
                document.getElementById('parent2'),
            ]);

            return {
                parent1: document.getElementById('parent1').innerHTML,
                parent2: document.getElementById('parent2').innerHTML,
            };
        });

        expect(result).toEqual({
            parent1: '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
            parent2: '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
        });
    });

    test('works with QuerySet other nodes', async ({ page }) => {
        const result = await page.evaluate(() => {
            $('a').appendTo($('div'));

            return {
                parent1: document.getElementById('parent1').innerHTML,
                parent2: document.getElementById('parent2').innerHTML,
            };
        });

        expect(result).toEqual({
            parent1: '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
            parent2: '<span></span>' +
                '<a href="#" class="test1">Test</a>' +
                '<a href="#" class="test2">Test</a>' +
                '<a href="#" class="test3">Test</a>' +
                '<a href="#" class="test4">Test</a>',
        });
    });
});
