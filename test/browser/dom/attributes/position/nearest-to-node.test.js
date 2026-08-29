import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#nearestToNode', () => {
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
        expect(await page.evaluate((_) => {
            const nearest = $.nearestToNode('[data-toggle="from"]', '[data-toggle="to"]');
            return nearest.id;
        })).toBe('test2');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.nearestToNode('#invalid', '[data-toggle="to"]'))).toBe(undefined);
    });

    test('returns undefined for empty other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.nearestToNode('[data-toggle="from"]', '#invalid'))).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const nearest = $.nearestToNode(
                document.getElementById('test1'),
                '[data-toggle="to"]',
            );
            return nearest.id;
        })).toBe('test1');
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const nearest = $.nearestToNode(
                document.querySelectorAll('[data-toggle="from"]'),
                '[data-toggle="to"]',
            );
            return nearest.id;
        })).toBe('test2');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const nearest = $.nearestToNode(
                document.getElementById('fromParent').children,
                '[data-toggle="to"]',
            );
            return nearest.id;
        })).toBe('test2');
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const nearest = $.nearestToNode([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], '[data-toggle="to"]');
            return nearest.id;
        })).toBe('test2');
    });

    test('works with HTMLElement other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const nearest = $.nearestToNode(
                '[data-toggle="from"]',
                document.getElementById('test3'),
            );
            return nearest.id;
        })).toBe('test2');
    });

    test('works with NodeList other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const nearest = $.nearestToNode(
                '[data-toggle="from"]',
                document.querySelectorAll('[data-toggle="to"]'),
            );
            return nearest.id;
        })).toBe('test2');
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const nearest = $.nearestToNode(
                '[data-toggle="from"]',
                document.getElementById('toParent').children,
            );
            return nearest.id;
        })).toBe('test2');
    });

    test('works with array other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const nearest = $.nearestToNode('[data-toggle="from"]', [
                document.getElementById('test3'),
                document.getElementById('test4'),
            ]);
            return nearest.id;
        })).toBe('test2');
    });
});
