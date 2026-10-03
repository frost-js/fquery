import { distToNodeTests, setup } from '#cases/attributes/position/dist-to-node.js';
import { expect, test } from '#test';

test.describe('QuerySet #distToNode', () => {
    test.beforeEach(setup);

    distToNodeTests(([nodes, ...args]) => $(nodes).distToNode(...args));

    test('works with HTMLElement other nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $('[data-toggle="from"]').distToNode(document.getElementById('test3')))).toBe(1250);
    });

    test('works with NodeList other nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $('[data-toggle="from"]').distToNode(document.querySelectorAll('[data-toggle="to"]')))).toBe(1250);
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $('[data-toggle="from"]').distToNode(document.getElementById('toParent').children))).toBe(1250);
    });

    test('works with array other nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $('[data-toggle="from"]')
                    .distToNode([
                        document.getElementById('test3'),
                        document.getElementById('test4'),
                    ]))).toBe(1250);
    });

    test('works with QuerySet other nodes', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query = $('[data-toggle="to"]');
            return $('[data-toggle="from"]').distToNode(query);
        })).toBe(1250);
    });
});
