import { setup, siblingsTests } from '#cases/traversal/traversal/siblings.js';
import { expect, test } from '#test';

test.describe('#siblings', () => {
    test.beforeEach(setup);

    siblingsTests((args) => $.siblings(...args).map((node) => node.id));

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => $.siblings('#invalid'));

        expect(ids).toEqual([]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.siblings(document.getElementById('span3'), '#span1, #span10').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.siblings(document.querySelectorAll('.span'), '#span1, #span10').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span10',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.siblings(document.getElementById('parent2').children, '#span1, #span10').map((node) => node.id));

        expect(ids).toEqual([
            'span10',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
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

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.siblings('.span', (node) => node.id === 'span5').map((node) => node.id));

        expect(ids).toEqual([
            'span5',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.siblings('.span', document.getElementById('span1')).map((node) => node.id));

        expect(ids).toEqual([
            'span1',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.siblings('.span', document.querySelectorAll('#span1, #span10')).map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span10',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.siblings('.span', document.getElementById('parent2').children).map((node) => node.id));

        expect(ids).toEqual([
            'span6',
            'span7',
            'span9',
            'span10',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.siblings('.span', [
                document.getElementById('span1'),
                document.getElementById('span10'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span10',
        ]);
    });
});
