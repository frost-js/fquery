import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1"><span id="span1"><a></a></span><span id="span2"><a></a></span><span id="span3" class="span"><a></a></span><span id="span4"><a></a></span><span id="span5"><a></a></span></div><div id="parent2"><span id="span6"><a></a></span><span id="span7"><a></a></span><span id="span8" class="span"><a></a></span><span id="span9"><a></a></span><span id="span10"><a></a></span></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#siblings', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns all siblings of each node', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.siblings('.span').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
            'span4',
            'span5',
            'span6',
            'span7',
            'span9',
            'span10',
        ]);
    });

    test('returns all siblings of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.siblings('.span', '#span1, #span10').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span10',
        ]);
    });

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
