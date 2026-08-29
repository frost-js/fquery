import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent"><span id="span1"><a></a></span><span id="span2" class="span"><a></a></span><span id="span3"><a></a></span><span id="span4"><a></a></span></div><div id="parent2"><span id="span5"><a></a></span><span id="span6" class="span"><a></a></span><span id="span7"><a></a></span><span id="span8"><a></a></span></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#next', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the next sibling of each node', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.next('.span').map((node) => node.id));

        expect(ids).toEqual([
            'span3',
            'span7',
        ]);
    });

    test('returns the next sibling of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.next('.span', '#span7').map((node) => node.id));

        expect(ids).toEqual([
            'span7',
        ]);
    });

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => $.next('#invalid'));

        expect(ids).toEqual([]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.next(document.getElementById('span6'), '#span7').map((node) => node.id));

        expect(ids).toEqual([
            'span7',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.next(document.querySelectorAll('.span'), '#span7').map((node) => node.id));

        expect(ids).toEqual([
            'span7',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.next(document.getElementById('parent2').children, '#span7').map((node) => node.id));

        expect(ids).toEqual([
            'span7',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.next(
                [
                    document.getElementById('span2'),
                    document.getElementById('span6'),
                ],
                '#span7',
            ).map((node) => node.id));

        expect(ids).toEqual([
            'span7',
        ]);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.next('.span', (node) => node.id === 'span7').map((node) => node.id));

        expect(ids).toEqual([
            'span7',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.next('.span', document.getElementById('span7')).map((node) => node.id));

        expect(ids).toEqual([
            'span7',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.next('.span', document.querySelectorAll('#span7')).map((node) => node.id));

        expect(ids).toEqual([
            'span7',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.next('.span', document.getElementById('parent2').children).map((node) => node.id));

        expect(ids).toEqual([
            'span7',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.next('.span', [
                document.getElementById('span3'),
                document.getElementById('span7'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'span3',
            'span7',
        ]);
    });
});
