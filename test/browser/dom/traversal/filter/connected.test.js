import { connectedTests, setup } from '#cases/traversal/filter/connected.js';
import { expect, test } from '#test';

test.describe('#connected', () => {
    test.beforeEach(setup);

    connectedTests((nodes) => $.connected(nodes).map((node) => node.id));

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.connected(document.getElementById('div1')).map((node) => node.id));

            expect(ids).toEqual([
                'div1',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.connected(document.querySelectorAll('div')).map((node) => node.id));

            expect(ids).toEqual([
                'div1',
                'div2',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.connected(document.body.children).map((node) => node.id));

            expect(ids).toEqual([
                'div1',
                'div2',
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const nodes = await page.evaluate((_) => {
                const fragment = document.createDocumentFragment();

                return $.connected(fragment);
            });

            expect(nodes).toEqual([]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const div = document.getElementById('div1');
                const shadow = div.attachShadow({ mode: 'open' });
                shadow.id = 'shadow';

                return $.connected(shadow).map((node) => node.id);
            });

            expect(ids).toEqual([
                'shadow',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.connected([
                    document.getElementById('div1'),
                    document.getElementById('div2'),
                ]).map((node) => node.id));

            expect(ids).toEqual([
                'div1',
                'div2',
            ]);
        });
    });
});
