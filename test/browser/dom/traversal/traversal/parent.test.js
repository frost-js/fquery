import { parentTests, setup } from '#cases/traversal/traversal/parent.js';
import { expect, test } from '#test';

test.describe('#parent', () => {
    test.beforeEach(setup);

    parentTests((args) => $.parent(...args).map((node) => node.id));

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => $.parent('#invalid'));

        expect(ids).toEqual([]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parent(document.getElementById('a2'), '#span2').map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parent(document.querySelectorAll('a'), '#span2').map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parent(document.getElementById('span2').children, '#span2').map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
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

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parent('a', (node) => node.id === 'span2').map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parent('a', document.getElementById('span2')).map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parent('a', document.querySelectorAll('#span2')).map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parent('a', document.getElementById('child2').children).map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parent('a', [document.getElementById('span2')]).map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });
});
