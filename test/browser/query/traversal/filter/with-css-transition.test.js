import { expect, test } from '#test';

test.describe('QuerySet #withCSSTransition', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: '.test { transition: opacity 1s; }' });
        await page.evaluate(() => {
            document.body.innerHTML = '<div id="div1" class="test"></div><div id="div2"></div><div id="div3" class="test"></div><div id="div4"></div>';
        });
    });

    test('returns nodes with CSS transitions', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').withCSSTransition().get().map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('returns nodes with a later nonzero CSS transition duration', async ({ page }) => {
        await page.addStyleTag({ content: '.test { transition: opacity 0s, transform 1s; }' });

        const ids = await page.evaluate((_) =>
            $('div').withCSSTransition().get().map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('returns no nodes when all CSS transition durations are zero', async ({ page }) => {
        await page.addStyleTag({ content: '.test { transition: opacity 0s, transform 0s; }' });

        const ids = await page.evaluate((_) =>
            $('div').withCSSTransition().get().map((node) => node.id));

        expect(ids).toEqual([]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.withCSSTransition();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });
});
