import { expect, test } from '#test';

test.describe('#withCSSAnimation', () => {
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
            $.withCSSAnimation('div').map((node) => node.id));

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
                $.withCSSAnimation('div').map((node) => node.id));

            expect(ids).toEqual(expected);
        });
    }

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCSSAnimation(document.getElementById('div1')).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCSSAnimation(document.querySelectorAll('div')).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCSSAnimation(document.body.children).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCSSAnimation([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });
});
