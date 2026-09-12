import { setup, withCssAnimationTests } from '#cases/traversal/filter/with-css-animation.js';
import { expect, test } from '#test';

test.describe('#withCssAnimation', () => {
    test.beforeEach(setup);

    withCssAnimationTests((nodes) => $.withCssAnimation(nodes).map((node) => node.id));

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCssAnimation(document.getElementById('div1')).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCssAnimation(document.querySelectorAll('div')).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCssAnimation(document.body.children).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCssAnimation([
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
