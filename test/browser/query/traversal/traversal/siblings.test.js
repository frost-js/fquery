import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1"><span id="span1"><a></a></span><span id="span2"><a></a></span><span id="span3" class="span"><a></a></span><span id="span4"><a></a></span><span id="span5"><a></a></span></div><div id="parent2"><span id="span6"><a></a></span><span id="span7"><a></a></span><span id="span8" class="span"><a></a></span><span id="span9"><a></a></span><span id="span10"><a></a></span></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #siblings', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns all siblings of each node', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').siblings().get().map((node) => node.id));

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
            $('.span').siblings('#span1, #span10').get().map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span10',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('.span');
            const query2 = query1.siblings();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').siblings((node) => node.id === 'span5').get().map((node) => node.id));

        expect(ids).toEqual([
            'span5',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').siblings(document.getElementById('span1')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span1',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').siblings(document.querySelectorAll('#span1, #span10')).get().map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span10',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span').siblings(document.getElementById('parent2').children).get().map((node) => node.id));

        expect(ids).toEqual([
            'span6',
            'span7',
            'span9',
            'span10',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.span')
                .siblings([
                    document.getElementById('span1'),
                    document.getElementById('span10'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span10',
        ]);
    });

    test('works with QuerySet filter', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('#span1, #span10');

            return $('.span').siblings(query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'span1',
            'span10',
        ]);
    });
});
