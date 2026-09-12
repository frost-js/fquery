import { prevTests, setup } from '#cases/traversal/traversal/prev.js';
import { expect, test } from '#test';

test.describe('#prev', () => {
    test.beforeEach(setup);

    prevTests((args) => $.prev(...args).map((node) => node.id));

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => $.prev('#invalid'));

        expect(ids).toEqual([]);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.prev(document.getElementById('span7'), '#span6').map((node) => node.id));

            expect(ids).toEqual([
                'span6',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.prev(document.querySelectorAll('.span'), '#span6').map((node) => node.id));

            expect(ids).toEqual([
                'span6',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.prev(document.getElementById('parent2').children, '#span6').map((node) => node.id));

            expect(ids).toEqual([
                'span6',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.prev(
                    [
                        document.getElementById('span3'),
                        document.getElementById('span7'),
                    ],
                    '#span6',
                ).map((node) => node.id));

            expect(ids).toEqual([
                'span6',
            ]);
        });
    });
});
