import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1"><span id="span1"><a></a></span><span id="span2" class="span"><a></a></span><span id="span3"><a></a></span><span id="span4"><a></a></span></div><div id="parent2"><span id="span5"><a></a></span><span id="span6" class="span"><a></a></span><span id="span7"><a></a></span><span id="span8"><a></a></span></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #nextAll', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns all next siblings of each node', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').nextAll().get().map((node) => node.id));

        expect(ids).toEqual([
            'span3',
            'span4',
            'span7',
            'span8',
        ]);
    });

    test('returns all next siblings of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').nextAll('#span4, #span8').get().map((node) => node.id));

        expect(ids).toEqual([
            'span4',
            'span8',
        ]);
    });

    test('returns all next siblings of each node before a limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').nextAll(null, '#span4, #span7').get().map((node) => node.id));

        expect(ids).toEqual([
            'span3',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('.span');
            const query2 = query1.nextAll();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').nextAll((node) => node.id === 'span8').get().map((node) => node.id));

        expect(ids).toEqual([
            'span8',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').nextAll(document.getElementById('span4')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span4',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').nextAll(document.querySelectorAll('#span4, #span8')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span4',
            'span8',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').nextAll(document.getElementById('parent2').children).get().map((node) => node.id));

        expect(ids).toEqual([
            'span7',
            'span8',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span')
                .nextAll([
                    document.getElementById('span4'),
                    document.getElementById('span8'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'span4',
            'span8',
        ]);
    });

    test('works with QuerySet filter', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('#span4, #span8');

            return $('.span').nextAll(query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'span4',
            'span8',
        ]);
    });

    test('works with function limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').nextAll(null, (node) => node.id === 'span7').get().map((node) => node.id));

        expect(ids).toEqual([
            'span3',
            'span4',
        ]);
    });

    test('works with HTMLElement limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').nextAll(null, document.getElementById('span7')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span3',
            'span4',
        ]);
    });

    test('works with NodeList limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').nextAll(null, document.querySelectorAll('#span4, #span7')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span3',
        ]);
    });

    test('works with HTMLCollection limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').nextAll(null, document.getElementById('parent2').children).get().map((node) => node.id));

        expect(ids).toEqual([
            'span3',
            'span4',
        ]);
    });

    test('works with array limit', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span')
                .nextAll(null, [
                    document.getElementById('span4'),
                    document.getElementById('span7'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'span3',
        ]);
    });

    test('works with QuerySet limit', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('#span4, #span7');

            return $('.span').nextAll(null, query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'span3',
        ]);
    });
});
