import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1"><span id="span1"><a></a></span><span id="span2"><a></a></span><span id="span3" class="span"><a></a></span><span id="span4"><a></a></span></div><div id="parent2"><span id="span5"><a></a></span><span id="span6"><a></a></span><span id="span7" class="span"><a></a></span><span id="span8"><a></a></span></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #prevAll', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns all previous siblings of each node', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prevAll().get().map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
            'span5',
            'span6',
        ]);
    });

    test('returns all previous siblings of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prevAll('#span1, #span5').get().map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span5',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('.span');
            const query2 = query1.prevAll();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prevAll((node) => node.id === 'span5').get().map((node) => node.id));

        expect(ids).toEqual([
            'span5',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prevAll(document.getElementById('span1')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span1',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prevAll(document.querySelectorAll('#span1, #span5')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span5',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prevAll(document.getElementById('parent2').children).get().map((node) => node.id));

        expect(ids).toEqual([
            'span5',
            'span6',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span')
                .prevAll([
                    document.getElementById('span1'),
                    document.getElementById('span5'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span5',
        ]);
    });

    test('works with QuerySet filter', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('#span1, #span5');

            return $('.span').prevAll(query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'span1',
            'span5',
        ]);
    });

    test('works with function limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prevAll(null, (node) => node.id === 'span6').get().map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('works with HTMLElement limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prevAll(null, document.getElementById('span6')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('works with NodeList limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prevAll(null, document.querySelectorAll('#span1, #span6')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with HTMLCollection limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prevAll(null, document.getElementById('parent2').children).get().map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('works with array limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span')
                .prevAll(null, [
                    document.getElementById('span1'),
                    document.getElementById('span6'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'span2',
        ]);
    });

    test('works with QuerySet limit', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('#span1, #span6');

            return $('.span').prevAll(null, query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'span2',
        ]);
    });
});
