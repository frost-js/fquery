import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1"><div id="child1"><span id="span1"><a id="a1"></a></span></div></div><div id="parent2"><div id="child2"><span id="span2"><a id="a2"></a></span></div></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#parent', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the parents of each node', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parent('a').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('returns the parents of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.parent('a', '#span2').map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

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
