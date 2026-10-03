import { parentsTests, setup } from '#cases/traversal/traversal/parents.js';
import { expect, test } from '#test';

test.describe('#parents', () => {
    test.beforeEach(setup);

    parentsTests((args) => $.parents(...args).map((node) => node.id));

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate(() => $.parents('#invalid'));

        expect(ids).toEqual([]);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.parents(document.getElementById('a1'), 'div').map((node) => node.id));

            expect(ids).toEqual([
                'parent1',
                'child1',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.parents(document.querySelectorAll('a'), 'div').map((node) => node.id));

            expect(ids).toEqual([
                'parent1',
                'child1',
                'parent2',
                'child2',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.parents(document.getElementById('child1').children, 'div').map((node) => node.id));

            expect(ids).toEqual([
                'parent1',
                'child1',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.parents(
                    [
                        document.getElementById('a1'),
                        document.getElementById('a2'),
                    ],
                    'div',
                ).map((node) => node.id));

            expect(ids).toEqual([
                'parent1',
                'child1',
                'parent2',
                'child2',
            ]);
        });
    });
});
