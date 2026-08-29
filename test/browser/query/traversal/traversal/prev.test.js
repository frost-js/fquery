import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent"><span id="span1"><a></a></span><span id="span2"><a></a></span><span id="span3" class="span"><a></a></span><span id="span4"><a></a></span></div><div id="parent2"><span id="span5"><a></a></span><span id="span6"><a></a></span><span id="span7" class="span"><a></a></span><span id="span8"><a></a></span></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #prev', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the previous sibling of each node', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prev().get().map((node) => node.id));

        expect(ids).toEqual([
            'span2',
            'span6',
        ]);
    });

    test('returns the previous sibling of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prev('#span6').get().map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('.span');
            const query2 = query1.prev();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prev((node) => node.id === 'span6').get().map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prev(document.getElementById('span6')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prev(document.querySelectorAll('#span6')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').prev(document.getElementById('parent2').children).get().map((node) => node.id));

        expect(ids).toEqual([
            'span6',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span')
                .prev([
                    document.getElementById('span2'),
                    document.getElementById('span6'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'span2',
            'span6',
        ]);
    });

    test('works with QuerySet filter', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('#span6');

            return $('.span').prev(query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'span6',
        ]);
    });
});
