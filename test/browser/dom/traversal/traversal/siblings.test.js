import { setup, siblingsTests } from '#cases/traversal/traversal/siblings.js';
import { expect, test } from '#test';

test.describe('#siblings', () => {
    test.beforeEach(setup);

    siblingsTests((args) => $.siblings(...args).map((node) => node.id));

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate(() => $.siblings('#invalid'));

        expect(ids).toEqual([]);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.siblings(document.getElementById('span3'), '#span1, #span10').map((node) => node.id));

            expect(ids).toEqual([
                'span1',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.siblings(document.querySelectorAll('.span'), '#span1, #span10').map((node) => node.id));

            expect(ids).toEqual([
                'span1',
                'span10',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.siblings(document.getElementById('parent2').children, '#span1, #span10').map((node) => node.id));

            expect(ids).toEqual([
                'span10',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.siblings(
                    [
                        document.getElementById('span3'),
                        document.getElementById('span8'),
                    ],
                    '#span1, #span10',
                ).map((node) => node.id));

            expect(ids).toEqual([
                'span1',
                'span10',
            ]);
        });
    });
});
