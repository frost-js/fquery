import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1"><div id="child1"><span id="span1"><a id="a1"></a></span></div></div><div id="parent2"><div id="child2"><span id="span2"><a id="a2"></a></span></div></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#parents', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the parents of each node', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents('a').map((node) => node.id));

        expect(ids).toEqual([
            'html',
            'body',
            'parent1',
            'child1',
            'span1',
            'parent2',
            'child2',
            'span2',
        ]);
    });

    test('returns the parents of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents('a', 'div').map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
            'parent2',
            'child2',
        ]);
    });

    test('returns the parents of each node before a limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents('a', null, 'div').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => $.parents('#invalid'));

        expect(ids).toEqual([]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents(document.getElementById('a1'), 'div').map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents(document.querySelectorAll('a'), 'div').map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
            'parent2',
            'child2',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents(document.getElementById('child1').children, 'div').map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents(
                [
                    document.getElementById('a1'),
                    document.getElementById('a2'),
                ],
                'div',
            ).map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
            'parent2',
            'child2',
        ]);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents('a', (node) => node.tagName === 'DIV').map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
            'parent2',
            'child2',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents('a', document.getElementById('child1')).map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents('a', document.querySelectorAll('div')).map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
            'parent2',
            'child2',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents('a', document.body.children).map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'parent2',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents('a', [
                document.getElementById('parent1'),
                document.getElementById('child1'),
                document.getElementById('parent2'),
                document.getElementById('child2'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
            'parent2',
            'child2',
        ]);
    });

    test('works with function limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents('a', null, (node) => node.id === 'body').map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
            'span1',
            'parent2',
            'child2',
            'span2',
        ]);
    });

    test('works with HTMLElement limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents('a', null, document.body).map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
            'child1',
            'span1',
            'parent2',
            'child2',
            'span2',
        ]);
    });

    test('works with NodeList limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents('a', null, document.querySelectorAll('div')).map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('works with HTMLCollection limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents('a', null, document.body.children).map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'span1',
            'child2',
            'span2',
        ]);
    });

    test('works with array limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parents('a', null, [
                document.getElementById('parent1'),
                document.getElementById('parent2'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'span1',
            'child2',
            'span2',
        ]);
    });
});
