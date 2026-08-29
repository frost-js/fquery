import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #distToNode', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="fromParent">' +
                '<div id="test1" data-toggle="from" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
                '<div id="test2" data-toggle="from"></div>' +
                '</div>' +
                '<div id="toParent">' +
                '<div id="test3" data-toggle="to" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
                '<div id="test4" data-toggle="to"></div>' +
                '</div>';
            window.scrollTo(1000, 1000);
        });
    });

    test('returns the distance from the first node to another node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('[data-toggle="from"]')
                    .distToNode('[data-toggle="to"]'))).toBe(1250);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#invalid')
                    .distToNode('[data-toggle="to"]'))).toBe(undefined);
    });

    test('returns undefined for empty other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('[data-toggle="from"]')
                    .distToNode('#invalid'))).toBe(undefined);
    });

    test('works with HTMLElement other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('[data-toggle="from"]')
                    .distToNode(
                        document.getElementById('test3'),
                    ))).toBe(1250);
    });

    test('works with NodeList other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('[data-toggle="from"]')
                    .distToNode(
                        document.querySelectorAll('[data-toggle="to"]'),
                    ))).toBe(1250);
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('[data-toggle="from"]')
                    .distToNode(
                        document.getElementById('toParent').children,
                    ))).toBe(1250);
    });

    test('works with array other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('[data-toggle="from"]')
                    .distToNode([
                        document.getElementById('test3'),
                        document.getElementById('test4'),
                    ]))).toBe(1250);
    });

    test('works with QuerySet other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('[data-toggle="to"]');
            return $('[data-toggle="from"]')
                    .distToNode(query);
        })).toBe(1250);
    });
});
