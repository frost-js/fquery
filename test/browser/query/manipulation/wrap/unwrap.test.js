import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const UNWRAP_HTML =
    '<div id="parent1">' +
    '<a href="#" id="test1">Test</a>' +
    '<a href="#" id="test2">Test</a>' +
    '</div>' +
    '<div id="parent2">' +
    '<a href="#" id="test3">Test</a>' +
    '<a href="#" id="test4">Test</a>' +
    '</div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #unwrap', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, UNWRAP_HTML);
    });

    test('unwraps each node', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('a').unwrap();

            return document.body.innerHTML;
        });

        expect(html).toBe('<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>');
    });

    test('unwraps each node with filter', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('a').unwrap('#parent1');

            return document.body.innerHTML;
        });

        expect(html).toBe('<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '<div id="parent2">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>');
    });

    test('removes events', async ({ page }) => {
        const count = await page.evaluate(() => {
            let result = 0;
            const parents = [...document.querySelectorAll('div')];

            $.addEvent('div', 'click', () => {
                result++;
            });
            $('a').unwrap();

            for (const parent of parents) {
                document.body.appendChild(parent);
            }

            $.triggerEvent('div', 'click');

            return result;
        });

        expect(count).toBe(0);
    });

    test('removes data', async ({ page }) => {
        const values = await page.evaluate(() => {
            const parents = [...document.querySelectorAll('div')];

            $.setData('div', 'test', 'Test');
            $('a').unwrap();

            for (const parent of parents) {
                document.body.appendChild(parent);
            }

            return [...document.querySelectorAll('div')].map((node) => $.getData(node, 'test'));
        });

        expect(values).toEqual([
            undefined,
            undefined,
        ]);
    });

    test('removes animations', async ({ page }) => {
        await page.evaluate(() => {
            $.animate(
                'div',
                () => {},
                {
                    duration: 100,
                    debug: true,
                },
            );
        });

        await expect.poll(async () =>
            await page.evaluate(() =>
                Boolean(document.querySelector('#parent1')?.dataset.animationProgress) &&
                Boolean(document.querySelector('#parent2')?.dataset.animationProgress)),
        ).toBe(true);

        const state = await page.evaluate(() => {
            const parents = [...document.querySelectorAll('div')];

            $('a').unwrap();

            for (const parent of parents) {
                document.body.appendChild(parent);
            }

            return {
                html: document.body.innerHTML,
                parent1: document.querySelector('#parent1')?.dataset.animationProgress ?? null,
                parent2: document.querySelector('#parent2')?.dataset.animationProgress ?? null,
            };
        });

        expect(state).toEqual({
            html: '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '<div id="parent1"></div>' +
                '<div id="parent2"></div>',
            parent1: null,
            parent2: null,
        });
    });

    test('removes queue', async ({ page }) => {
        const state = await page.evaluate(async () => {
            window.unwrapQueueResolvers = [];

            $.queue('div', () =>
                new Promise((resolve) => {
                    window.unwrapQueueResolvers.push(resolve);
                }),
            );
            $.queue('div', (node) => {
                node.dataset.test = 'Test';
            });

            const parents = [...document.querySelectorAll('div')];

            $('a').unwrap();

            for (const parent of parents) {
                document.body.appendChild(parent);
            }

            window.unwrapQueueResolvers.splice(0).forEach((resolve) => {
                resolve();
            });

            await new Promise((resolve) => {
                setTimeout(resolve, 0);
            });

            return {
                html: document.body.innerHTML,
                values: [...document.querySelectorAll('div')].map((node) => node.getAttribute('data-test')),
            };
        });

        expect(state).toEqual({
            html: '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '<div id="parent1"></div>' +
                '<div id="parent2"></div>',
            values: [
                null,
                null,
            ],
        });
    });

    test('triggers a remove event', async ({ page }) => {
        const count = await page.evaluate(() => {
            let result = 0;

            $.addEvent('div', 'remove', () => {
                result++;
            });
            $('a').unwrap();

            return result;
        });

        expect(count).toBe(2);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsQuery = await page.evaluate(() => {
            const query = $('a');

            return query === query.unwrap();
        });

        expect(returnsQuery).toBe(true);
    });

    test('works with function filter', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('a').unwrap(
                (node) => node.id === 'parent1',
            );

            return document.body.innerHTML;
        });

        expect(html).toBe('<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '<div id="parent2">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>');
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('a').unwrap(
                document.getElementById('parent1'),
            );

            return document.body.innerHTML;
        });

        expect(html).toBe('<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '<div id="parent2">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>');
    });

    test('works with NodeList filter', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('a').unwrap(
                document.querySelectorAll('#parent1'),
            );

            return document.body.innerHTML;
        });

        expect(html).toBe('<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '<div id="parent2">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>');
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('a').unwrap(
                document.body.children,
            );

            return document.body.innerHTML;
        });

        expect(html).toBe('<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>');
    });

    test('works with array filter', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('a').unwrap([
                document.getElementById('parent1'),
            ]);

            return document.body.innerHTML;
        });

        expect(html).toBe('<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '<div id="parent2">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>');
    });

    test('works with QuerySet filter', async ({ page }) => {
        const html = await page.evaluate(() => {
            const query = $('#parent1');

            $('a').unwrap(query);

            return document.body.innerHTML;
        });

        expect(html).toBe('<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '<div id="parent2">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>');
    });
});
