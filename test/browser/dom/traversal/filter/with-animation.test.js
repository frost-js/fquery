import { setup, withAnimationTests } from '#cases/traversal/filter/with-animation.js';
import { expect, test } from '#test';

test.describe('#withAnimation', () => {
    test.beforeEach(setup);

    withAnimationTests((nodes) => $.withAnimation(nodes).map((node) => node.id));

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.withAnimation(document.getElementById('div1')).map((node) => node.id))).toEqual([
                'div1',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.withAnimation(document.querySelectorAll('div')).map((node) => node.id))).toEqual([
                'div1',
                'div3',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.withAnimation(document.body.children).map((node) => node.id))).toEqual([
                'div1',
                'div3',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.withAnimation([
                    document.getElementById('div1'),
                    document.getElementById('div2'),
                    document.getElementById('div3'),
                    document.getElementById('div4'),
                ]).map((node) => node.id))).toEqual([
                'div1',
                'div3',
            ]);
        });
    });
});
