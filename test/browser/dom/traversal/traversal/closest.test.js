import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1"><div id="child1"><span id="span1"><a id="a1"></a></span></div></div><div id="parent2"><div id="child2"><span id="span2"><a id="a2"></a></span></div></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#closest', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the closest ancestor of each node', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest('a').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('returns the closest ancestor of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest('a', 'div').map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'child2',
        ]);
    });

    test('returns the closest ancestor of each node before a limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.closest('a', 'div', '#span2').map((node) => node.id));

        expect(ids).toEqual([
            'child1',
        ]);
    });

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
