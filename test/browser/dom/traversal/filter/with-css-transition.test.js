import { setup, withCSSTransitionTests } from '#cases/traversal/filter/with-css-transition.js';
import { expect, test } from '#test';

test.describe('#withCSSTransition', () => {
    test.beforeEach(setup);

    withCSSTransitionTests((nodes) => $.withCSSTransition(nodes).map((node) => node.id));

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCSSTransition(document.getElementById('div1')).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCSSTransition(document.querySelectorAll('div')).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCSSTransition(document.body.children).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCSSTransition([
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
