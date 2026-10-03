import { parentTests, setup } from '#cases/traversal/traversal/parent.js';
import { expect, test } from '#test';

test.describe('#parent', () => {
    test.beforeEach(setup);

    parentTests((args) => $.parent(...args).map((node) => node.id));

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate(() => $.parent('#invalid'));

        expect(ids).toEqual([]);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.parent(document.getElementById('a2'), '#span2').map((node) => node.id));

            expect(ids).toEqual([
                'span2',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.parent(document.querySelectorAll('a'), '#span2').map((node) => node.id));

            expect(ids).toEqual([
                'span2',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.parent(document.getElementById('span2').children, '#span2').map((node) => node.id));

            expect(ids).toEqual([
                'span2',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.parent(
                    [
                        document.getElementById('a1'),
                        document.getElementById('a2'),
                    ],
                    '#span2',
                ).map((node) => node.id));

            expect(ids).toEqual([
                'span2',
            ]);
        });
    });
});
