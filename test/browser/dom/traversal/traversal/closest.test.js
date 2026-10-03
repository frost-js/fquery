import { closestTests, setup } from '#cases/traversal/traversal/closest.js';
import { expect, test } from '#test';

test.describe('#closest', () => {
    test.beforeEach(setup);

    closestTests((args) => $.closest(...args).map((node) => node.id));

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate(() => $.closest('#invalid'));

        expect(ids).toEqual([]);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.closest(document.getElementById('a1'), 'div').map((node) => node.id));

            expect(ids).toEqual([
                'child1',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.closest(document.querySelectorAll('a'), 'div').map((node) => node.id));

            expect(ids).toEqual([
                'child1',
                'child2',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.closest(document.getElementById('child1').children, 'div').map((node) => node.id));

            expect(ids).toEqual([
                'child1',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.closest(
                    [
                        document.getElementById('a1'),
                        document.getElementById('a2'),
                    ],
                    'div',
                ).map((node) => node.id));

            expect(ids).toEqual([
                'child1',
                'child2',
            ]);
        });
    });
});
