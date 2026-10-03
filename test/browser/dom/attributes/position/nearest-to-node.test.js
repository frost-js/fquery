import { nearestToNodeTests, setup } from '#cases/attributes/position/nearest-to-node.js';
import { expect, test } from '#test';

test.describe('#nearestToNode', () => {
    test.beforeEach(setup);

    nearestToNodeTests((args) => [$.nearestToNode(...args).id]);

    test.describe('empty results', () => {
        test('returns undefined for empty nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.nearestToNode('#invalid', '[data-toggle="to"]'))).toBe(undefined);
        });

        test('returns undefined for empty other nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.nearestToNode('[data-toggle="from"]', '#invalid'))).toBe(undefined);
        });
    });

    test.describe('source inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const nearest = $.nearestToNode(document.getElementById('test1'), '[data-toggle="to"]');
                return nearest.id;
            })).toBe('test1');
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const nearest = $.nearestToNode(document.querySelectorAll('[data-toggle="from"]'), '[data-toggle="to"]');
                return nearest.id;
            })).toBe('test2');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const nearest = $.nearestToNode(document.getElementById('fromParent').children, '[data-toggle="to"]');
                return nearest.id;
            })).toBe('test2');
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const nearest = $.nearestToNode([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ], '[data-toggle="to"]');
                return nearest.id;
            })).toBe('test2');
        });
    });
});
