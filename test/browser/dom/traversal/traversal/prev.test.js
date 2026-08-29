import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent"><span id="span1"><a></a></span><span id="span2"><a></a></span><span id="span3" class="span"><a></a></span><span id="span4"><a></a></span></div><div id="parent2"><span id="span5"><a></a></span><span id="span6"><a></a></span><span id="span7" class="span"><a></a></span><span id="span8"><a></a></span></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#prev', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the previous sibling of each node', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prev('.span').map((node) => node.id));

        expect(ids).toEqual([
            'span2',
            'span6',
        ]);
    });

    test('returns the previous sibling of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prev('.span', '#span6').map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => $.prev('#invalid'));

        expect(ids).toEqual([]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prev(document.getElementById('span7'), '#span6').map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prev(document.querySelectorAll('.span'), '#span6').map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prev(document.getElementById('parent2').children, '#span6').map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prev(
                [
                    document.getElementById('span3'),
                    document.getElementById('span7'),
                ],
                '#span6',
            ).map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prev('.span', (node) => node.id === 'span6').map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prev('.span', document.getElementById('span6')).map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prev('.span', document.querySelectorAll('#span6')).map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prev('.span', document.getElementById('parent2').children).map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prev('.span', [
                document.getElementById('span2'),
                document.getElementById('span6'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'span2',
            'span6',
        ]);
    });
});
