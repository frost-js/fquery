import { nextAllTests, setup } from '#cases/traversal/traversal/next-all.js';
import { expect, test } from '#test';

test.describe('#nextAll', () => {
    test.beforeEach(setup);

    nextAllTests((args) => $.nextAll(...args).map((node) => node.id));

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate(() => $.nextAll('#invalid'));

        expect(ids).toEqual([]);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.nextAll(document.getElementById('span2'), '#span4, #span8').map((node) => node.id));

            expect(ids).toEqual([
                'span4',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.nextAll(document.querySelectorAll('.span'), '#span4, #span8').map((node) => node.id));

            expect(ids).toEqual([
                'span4',
                'span8',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.nextAll(document.getElementById('parent2').children, '#span4, #span8').map((node) => node.id));

            expect(ids).toEqual([
                'span8',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.nextAll(
                    [
                        document.getElementById('span2'),
                        document.getElementById('span6'),
                    ],
                    '#span4, #span8',
                ).map((node) => node.id));

            expect(ids).toEqual([
                'span4',
                'span8',
            ]);
        });
    });
});
