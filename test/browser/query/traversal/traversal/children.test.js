import { childrenTests, setup } from '#cases/traversal/traversal/children.js';
import { expect, test } from '#test';

test.describe('QuerySet #children', () => {
    test.beforeEach(setup);

    childrenTests(([nodes, ...args]) => $(nodes).children(...args).get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('.parent');
            const query2 = query1.children();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('shadowed properties', () => {
        test('returns form children when a control shadows children', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                document.body.innerHTML =
                    '<form><input id="test1" name="children"><input id="test2"></form>';
                const nodes = $('form').children().get();
                return nodes.map((node) => node.id);
            });

            expect(ids).toEqual([
                'test1',
                'test2',
            ]);
        });

        test('returns form child nodes when a control shadows childNodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                document.body.innerHTML =
                    '<form><input id="test1"><input id="test2" name="childNodes"></form>';
                const nodes = $('form').children(null, { elementsOnly: false }).get();
                return nodes.map((node) => node.id);
            });

            expect(ids).toEqual([
                'test1',
                'test2',
            ]);
        });
    });

    test.describe('node inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div id="div1"></div><div id="div2"></div>',
                );

                return $(fragment).children('div').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
                'div2',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div id="div1"></div><div id="div2"></div>',
                );
                shadow.appendChild(fragment);

                return $(shadow).children('div').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
                'div2',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $(document).children('html').get().map((node) => node.id));

            expect(ids).toEqual([
                'html',
            ]);
        });
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet filter', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const query = $('span');

                return $('.parent').children(query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'child3',
                'child4',
                'child7',
                'child8',
            ]);
        });
    });
});
