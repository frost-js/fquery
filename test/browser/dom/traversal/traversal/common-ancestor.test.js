import { commonAncestorTests, setup } from '#cases/traversal/traversal/common-ancestor.js';
import { expect, test } from '#test';

test.describe('#commonAncestor', () => {
    test.beforeEach(setup);

    commonAncestorTests((nodes) => [$.commonAncestor(nodes).id]);

    test.describe('empty results', () => {
        test('returns undefined for empty nodes', async ({ page }) => {
            const ancestor = await page.evaluate(() => $.commonAncestor('#invalid'));

            expect(ancestor).toBe(undefined);
        });

        test('returns undefined for nodes in separate detached trees', async ({ page }) => {
            const ancestor = await page.evaluate(() => {
                const parent1 = document.createElement('div');
                const parent2 = document.createElement('div');
                const node1 = document.createElement('span');
                const node2 = document.createElement('span');

                parent1.appendChild(node1);
                parent2.appendChild(node2);

                return $.commonAncestor([node1, node2]);
            });

            expect(ancestor).toBe(undefined);
        });

        test('returns undefined when a middle node belongs to another tree', async ({ page }) => {
            const ancestor = await page.evaluate(() => {
                const parent1 = document.createElement('div');
                const parent2 = document.createElement('div');
                const node1 = document.createElement('span');
                const node2 = document.createElement('span');
                const node3 = document.createElement('span');

                parent1.appendChild(node1);
                parent2.appendChild(node2);
                parent1.appendChild(node3);

                return $.commonAncestor([node1, node2, node3]);
            });

            expect(ancestor).toBe(undefined);
        });
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.commonAncestor(document.getElementById('a1')).id);

            expect(id).toBe('span1');
        });

        test('works with NodeList nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.commonAncestor(document.querySelectorAll('a')).id);

            expect(id).toBe('child');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.commonAncestor(document.getElementById('span1').children).id);

            expect(id).toBe('span1');
        });

        test('works with array nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.commonAncestor([
                    document.getElementById('a1'),
                    document.getElementById('a2'),
                ]).id);

            expect(id).toBe('child');
        });
    });
});
