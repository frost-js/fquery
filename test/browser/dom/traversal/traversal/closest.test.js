import { closestTests, setup } from '#cases/traversal/traversal/closest.js';
import { expect, test } from '#test';

test.describe('#closest', () => {
    test.beforeEach(setup);

    closestTests((args) => $.closest(...args).map((node) => node.id));

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => $.closest('#invalid'));

        expect(ids).toEqual([]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest(document.getElementById('a1'), 'div').map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest(document.querySelectorAll('a'), 'div').map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'child2',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest(document.getElementById('child1').children, 'div').map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
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

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest('a', (node) => node.tagName === 'DIV').map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'child2',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest('a', document.getElementById('child1')).map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest('a', document.querySelectorAll('div')).map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'child2',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest('a', document.body.children).map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'parent2',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest('a', [
                document.getElementById('child1'),
                document.getElementById('child2'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'child2',
        ]);
    });

    test('works with function limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest('a', 'div', (node) => node.id === 'span2').map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('works with HTMLElement limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest('a', 'div', document.getElementById('span2')).map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('works with NodeList limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest('a', 'div', document.querySelectorAll('#span2')).map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('works with HTMLCollection limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest('a', 'div', document.getElementById('child2').children).map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('works with array limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest('a', 'div', [document.getElementById('span2')]).map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });
});
