import { nextAllTests, setup } from '#cases/traversal/traversal/next-all.js';
import { expect, test } from '#test';

test.describe('#nextAll', () => {
    test.beforeEach(setup);

    nextAllTests((args) => $.nextAll(...args).map((node) => node.id));

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => $.nextAll('#invalid'));

        expect(ids).toEqual([]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.nextAll(document.getElementById('span2'), '#span4, #span8').map((node) => node.id));

        expect(ids).toEqual([
            'span4',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.nextAll(document.querySelectorAll('.span'), '#span4, #span8').map((node) => node.id));

        expect(ids).toEqual([
            'span4',
            'span8',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.nextAll(document.getElementById('parent2').children, '#span4, #span8').map((node) => node.id));

        expect(ids).toEqual([
            'span8',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
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

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.nextAll('.span', (node) => node.id === 'span8').map((node) => node.id));

        expect(ids).toEqual([
            'span8',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.nextAll('.span', document.getElementById('span4')).map((node) => node.id));

        expect(ids).toEqual([
            'span4',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.nextAll('.span', document.querySelectorAll('#span4, #span8')).map((node) => node.id));

        expect(ids).toEqual([
            'span4',
            'span8',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.nextAll('.span', document.getElementById('parent2').children).map((node) => node.id));

        expect(ids).toEqual([
            'span7',
            'span8',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.nextAll('.span', [
                document.getElementById('span4'),
                document.getElementById('span8'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'span4',
            'span8',
        ]);
    });

    test('works with function limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.nextAll('.span', null, (node) => node.id === 'span7').map((node) => node.id));

        expect(ids).toEqual([
            'span3',
            'span4',
        ]);
    });

    test('works with HTMLElement limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.nextAll('.span', null, document.getElementById('span7')).map((node) => node.id));

        expect(ids).toEqual([
            'span3',
            'span4',
        ]);
    });

    test('works with NodeList limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.nextAll('.span', null, document.querySelectorAll('#span4, #span7')).map((node) => node.id));

        expect(ids).toEqual([
            'span3',
        ]);
    });

    test('works with HTMLCollection limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.nextAll('.span', null, document.getElementById('parent2').children).map((node) => node.id));

        expect(ids).toEqual([
            'span3',
            'span4',
        ]);
    });

    test('works with array limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.nextAll('.span', null, [
                document.getElementById('span4'),
                document.getElementById('span7'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'span3',
        ]);
    });
});
