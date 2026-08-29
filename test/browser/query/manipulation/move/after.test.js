import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const SIBLING_MOVE_HTML =
    '<div id="parent1">' +
    '<span></span>' +
    '<a href="#" class="test1">Test</a>' +
    '<a href="#" class="test2">Test</a>' +
    '</div>' +
    '<div id="parent2">' +
    '<span></span>' +
    '<a href="#" class="test3">Test</a>' +
    '<a href="#" class="test4">Test</a>' +
    '</div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #after', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, SIBLING_MOVE_HTML);
    });

    test('inserts each other node after each node', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('div').after('a');

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

    test('preserves events for other nodes', async ({ page }) => {
        const clickCount = await page.evaluate(() => {
            let count = 0;

            $.addEvent('a', 'click', () => {
                count++;
            });

            $('div').after('a');
            $.triggerEvent('a', 'click');

            return count;
        });

        expect(clickCount).toBe(8);
    });

    test('preserves data for other nodes', async ({ page }) => {
        const values = await page.evaluate(() => {
            $.setData('a', 'test', 'Test');
            $('div').after('a');

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

    test('preserves animations for other nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.animate(
                'a',
                () => {},
                {
                    duration: 100,
                    debug: true,
                },
            );

            $('div').after('a');
        });

        await expect.poll(async () => await page.evaluate(() => {
            const nodes = [...document.querySelectorAll('body > a')];

            return nodes.length === 8 &&
                nodes.every((node) => Boolean(node.dataset.animationProgress));
        })).toBe(true);

        await expect.poll(async () => await page.evaluate(() =>
            [...document.querySelectorAll('body > a')].every((node) =>
                !node.dataset.animationProgress &&
                !node.dataset.animationStart &&
                !node.dataset.animationTime),
        )).toBe(true);
    });

    test('does not clone for the last other nodes', async ({ page }) => {
        const isSameNode = await page.evaluate(() => {
            const nodes = [...document.querySelectorAll('a')];

            $('div').after('a');

            return nodes.every((node, index) =>
                node.isSameNode(document.querySelectorAll('body > a').item(index + 4)));
        });

        expect(isSameNode).toBe(true);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsSameQuery = await page.evaluate(() => {
            const query = $('div');

            return query === query.after('a');
        });

        expect(returnsSameQuery).toBe(true);
    });

    test('works with HTMLElement other nodes', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('div').after(document.querySelector('.test1'));

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
            $('div').after(document.querySelectorAll('a'));

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
            $('div').after(document.getElementById('parent1').children);

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
            $('div').after(document.createRange().createContextualFragment('<div><span></span></div>'));

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
            $('div').after([
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
            $('div').after('<div><span></span></div>');

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

    test('works with QuerySet other nodes', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('div').after($('a'));

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
