import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #nearestToNode', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="fromParent">' +
                '<div id="test1" data-toggle="from" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
                '<div id="test2" data-toggle="from" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
                '</div>' +
                '<div id="toParent">' +
                '<div id="test3" data-toggle="to"></div>' +
                '<div id="test4" data-toggle="to"></div>' +
                '</div>';
            window.scrollTo(1000, 1000);
        });
    });

    test('returns the nearest node to another node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('[data-toggle="from"]')
                    .nearestToNode('[data-toggle="to"]')
                    .get()
                    .map((node) => node.id))).toEqual([
            'test2',
        ]);
    });

    test('returns an empty QuerySet for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#invalid')
                    .nearestToNode('[data-toggle="to"]')
                    .get())).toEqual([]);
    });

    test('returns an empty QuerySet for empty other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('[data-toggle="from"]')
                    .nearestToNode('#invalid')
                    .get())).toEqual([]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.nearestToNode('[data-toggle="to"]');
            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        })).toBe(true);
    });

    test('works with HTMLElement other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('[data-toggle="from"]')
                    .nearestToNode(
                        document.getElementById('test3'),
                    )
                    .get()
                    .map((node) => node.id))).toEqual([
            'test2',
        ]);
    });

    test('works with NodeList other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('[data-toggle="from"]')
                    .nearestToNode(
                        document.querySelectorAll('[data-toggle="to"]'),
                    )
                    .get()
                    .map((node) => node.id))).toEqual([
            'test2',
        ]);
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('[data-toggle="from"]')
                    .nearestToNode(
                        document.getElementById('toParent').children,
                    )
                    .get()
                    .map((node) => node.id))).toEqual([
            'test2',
        ]);
    });

    test('works with array other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('[data-toggle="from"]')
                    .nearestToNode([
                        document.getElementById('test3'),
                        document.getElementById('test4'),
                    ])
                    .get()
                    .map((node) => node.id))).toEqual([
            'test2',
        ]);
    });

    test('works with QuerySet other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('[data-toggle="to"]');
            return $('[data-toggle="from"]')
                    .nearestToNode(query)
                    .get()
                    .map((node) => node.id);
        })).toEqual([
            'test2',
        ]);
    });
});
