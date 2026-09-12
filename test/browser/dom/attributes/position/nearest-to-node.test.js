import { nearestToNodeTests, setup } from '#cases/attributes/position/nearest-to-node.js';
import { expect, test } from '#test';

test.describe('#nearestToNode', () => {
    test.beforeEach(setup);

    nearestToNodeTests((args) => {
        const node = $.nearestToNode(...args);
        return node === undefined ? undefined : node.id;
    });

    test.describe('source inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const nearest = $.nearestToNode(document.getElementById('test1'), '[data-toggle="to"]');
                return nearest.id;
            })).toBe('test1');
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const nearest = $.nearestToNode(document.querySelectorAll('[data-toggle="from"]'), '[data-toggle="to"]');
                return nearest.id;
            })).toBe('test2');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const nearest = $.nearestToNode(document.getElementById('fromParent').children, '[data-toggle="to"]');
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
    });
});
