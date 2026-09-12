import { nextTests, setup } from '#cases/traversal/traversal/next.js';
import { expect, test } from '#test';

test.describe('#next', () => {
    test.beforeEach(setup);

    nextTests((args) => $.next(...args).map((node) => node.id));

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => $.next('#invalid'));

        expect(ids).toEqual([]);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.next(document.getElementById('span6'), '#span7').map((node) => node.id));

            expect(ids).toEqual([
                'span7',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.next(document.querySelectorAll('.span'), '#span7').map((node) => node.id));

            expect(ids).toEqual([
                'span7',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.next(document.getElementById('parent2').children, '#span7').map((node) => node.id));

            expect(ids).toEqual([
                'span7',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.next(
                    [
                        document.getElementById('span2'),
                        document.getElementById('span6'),
                    ],
                    '#span7',
                ).map((node) => node.id));

            expect(ids).toEqual([
                'span7',
            ]);
        });
    });
});
