import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent"><span id="span1"><a></a></span><span id="span2" class="span"><a></a></span><span id="span3"><a></a></span><span id="span4"><a></a></span></div><div id="parent2"><span id="span5"><a></a></span><span id="span6" class="span"><a></a></span><span id="span7"><a></a></span><span id="span8"><a></a></span></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #next', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the next sibling of each node', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').next().get().map((node) => node.id));

        expect(ids).toEqual([
            'span3',
            'span7',
        ]);
    });

    test('returns the next sibling of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').next('#span7').get().map((node) => node.id));

        expect(ids).toEqual([
            'span7',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('.span');
            const query2 = query1.next();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').next((node) => node.id === 'span7').get().map((node) => node.id));

        expect(ids).toEqual([
            'span7',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').next(document.getElementById('span7')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span7',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').next(document.querySelectorAll('#span7')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span7',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').next(document.getElementById('parent2').children).get().map((node) => node.id));

        expect(ids).toEqual([
            'span7',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span')
                .next([
                    document.getElementById('span3'),
                    document.getElementById('span7'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'span3',
            'span7',
        ]);
    });

    test('works with QuerySet filter', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('#span7');

            return $('.span').next(query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'span7',
        ]);
    });
});
