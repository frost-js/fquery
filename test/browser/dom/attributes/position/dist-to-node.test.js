import { distToNodeTests, setup } from '#cases/attributes/position/dist-to-node.js';
import { expect, test } from '#test';

test.describe('#distToNode', () => {
    test.beforeEach(setup);

    distToNodeTests((args) => $.distToNode(...args));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.distToNode(document.getElementById('test1'), '[data-toggle="to"]'))).toBe(1250);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.distToNode(document.querySelectorAll('[data-toggle="from"]'), '[data-toggle="to"]'))).toBe(1250);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.distToNode(document.getElementById('fromParent').children, '[data-toggle="to"]'))).toBe(1250);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.distToNode([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], '[data-toggle="to"]'))).toBe(1250);
    });

    test('works with HTMLElement other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.distToNode('[data-toggle="from"]', document.getElementById('test3')))).toBe(1250);
    });

    test('works with NodeList other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.distToNode('[data-toggle="from"]', document.querySelectorAll('[data-toggle="to"]')))).toBe(1250);
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.distToNode('[data-toggle="from"]', document.getElementById('toParent').children))).toBe(1250);
    });

    test('works with array other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.distToNode('[data-toggle="from"]', [
                document.getElementById('test3'),
                document.getElementById('test4'),
            ]))).toBe(1250);
    });
});
