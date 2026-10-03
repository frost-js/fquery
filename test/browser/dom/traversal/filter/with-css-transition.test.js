import { setup, withCssTransitionTests } from '#cases/traversal/filter/with-css-transition.js';
import { expect, test } from '#test';

test.describe('#withCssTransition', () => {
    test.beforeEach(setup);

    withCssTransitionTests((nodes) => $.withCssTransition(nodes).map((node) => node.id));

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.withCssTransition(document.getElementById('div1')).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.withCssTransition(document.querySelectorAll('div')).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.withCssTransition(document.body.children).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.withCssTransition([
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
