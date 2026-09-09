import { expect, test } from '#test';

test.describe('QuerySet #withCSSAnimation', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({
            content: '.test { animation: spin 4s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }',
        });
        await page.evaluate(() => {
            document.body.innerHTML = '<div id="div1" class="test"></div><div id="div2"></div><div id="div3" class="test"></div><div id="div4"></div>';
        });
    });

    test('returns nodes with CSS animations', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').withCSSAnimation().get().map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    for (const [duration, expected] of [
        ['1s', ['div1', 'div3']],
        ['0s', []],
    ]) {
        test(`filters nodes with CSS animation durations of 0s, ${duration}`, async ({ page }) => {
            await page.addStyleTag({ content: '.test { animation: spin 0s linear infinite, spin ' + duration + ' linear infinite; }' });

            const ids = await page.evaluate((_) =>
                $('div').withCSSAnimation().get().map((node) => node.id));

            expect(ids).toEqual(expected);
        });
    }

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.withCSSAnimation();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });
});
