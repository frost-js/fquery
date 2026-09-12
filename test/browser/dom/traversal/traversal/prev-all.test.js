import { prevAllTests, setup } from '#cases/traversal/traversal/prev-all.js';
import { expect, test } from '#test';

test.describe('#prevAll', () => {
    test.beforeEach(setup);

    prevAllTests((args) => $.prevAll(...args).map((node) => node.id));

    test('returns all previous siblings of each node before a limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll('.span', null, '#span1, #span6').map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => $.prevAll('#invalid'));

        expect(ids).toEqual([]);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.prevAll(document.getElementById('span3'), '#span1, #span5').map((node) => node.id));

            expect(ids).toEqual([
                'span1',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.prevAll(document.querySelectorAll('.span'), '#span1, #span5').map((node) => node.id));

            expect(ids).toEqual([
                'span1',
                'span5',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.prevAll(document.getElementById('parent2').children, '#span1, #span5').map((node) => node.id));

            expect(ids).toEqual([
                'span5',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.prevAll(
                    [
                        document.getElementById('span3'),
                        document.getElementById('span7'),
                    ],
                    '#span1, #span5',
                ).map((node) => node.id));

            expect(ids).toEqual([
                'span1',
                'span5',
            ]);
        });
    });
});
