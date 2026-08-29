import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1"><span id="span1"><a></a></span><span id="span2"><a></a></span><span id="span3" class="span"><a></a></span><span id="span4"><a></a></span></div><div id="parent2"><span id="span5"><a></a></span><span id="span6"><a></a></span><span id="span7" class="span"><a></a></span><span id="span8"><a></a></span></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#prevAll', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns all previous siblings of each node', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll('.span').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
            'span5',
            'span6',
        ]);
    });

    test('returns all previous siblings of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll('.span', '#span1, #span5').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span5',
        ]);
    });

    test('returns all previous siblings of each node before a limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll('.span', null, '#span1, #span6').map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => $.prevAll('#invalid'));

        expect(ids).toEqual([]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll(document.getElementById('span3'), '#span1, #span5').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll(document.querySelectorAll('.span'), '#span1, #span5').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span5',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll(document.getElementById('parent2').children, '#span1, #span5').map((node) => node.id));

        expect(ids).toEqual([
            'span5',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll(
                [
                    document.getElementById('span3'),
                    document.getElementById('span7'),
                ],
                '#span1, #span5',
            ).map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span5',
        ]);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll('.span', (node) => node.id === 'span5').map((node) => node.id));

        expect(ids).toEqual([
            'span5',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll('.span', document.getElementById('span1')).map((node) => node.id));

        expect(ids).toEqual([
            'span1',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll('.span', document.querySelectorAll('#span1, #span5')).map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span5',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll('.span', document.getElementById('parent2').children).map((node) => node.id));

        expect(ids).toEqual([
            'span5',
            'span6',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll('.span', [
                document.getElementById('span1'),
                document.getElementById('span5'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span5',
        ]);
    });

    test('works with function limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll('.span', null, (node) => node.id === 'span6').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('works with HTMLElement limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll('.span', null, document.getElementById('span6')).map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('works with NodeList limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll('.span', null, document.querySelectorAll('#span1, #span6')).map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with HTMLCollection limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll('.span', null, document.getElementById('parent2').children).map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('works with array limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.prevAll('.span', null, [
                document.getElementById('span1'),
                document.getElementById('span6'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });
});
