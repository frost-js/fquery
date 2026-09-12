import { commonAncestorTests, setup } from '#cases/traversal/traversal/common-ancestor.js';
import { expect, test } from '#test';

test.describe('#commonAncestor', () => {
    test.beforeEach(setup);

    commonAncestorTests((nodes) => {
        const node = $.commonAncestor(nodes);
        return node === undefined ? undefined : node.id;
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const ancestor = await page.evaluate((_) => $.commonAncestor('#invalid'));

        expect(ancestor).toBe(undefined);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const id = await page.evaluate((_) =>
                $.commonAncestor(document.getElementById('a1')).id);

            expect(id).toBe('span1');
        });

        test('works with NodeList nodes', async ({ page }) => {
            const id = await page.evaluate((_) =>
                $.commonAncestor(document.querySelectorAll('a')).id);

            expect(id).toBe('child');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const id = await page.evaluate((_) =>
                $.commonAncestor(document.getElementById('span1').children).id);

            expect(id).toBe('span1');
        });

        test('works with array nodes', async ({ page }) => {
            const id = await page.evaluate((_) =>
                $.commonAncestor([
                    document.getElementById('a1'),
                    document.getElementById('a2'),
                ]).id);

            expect(id).toBe('child');
        });
    });
});
