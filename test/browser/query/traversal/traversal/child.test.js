import { childTests, setup } from '#cases/traversal/traversal/child.js';
import { expect, test } from '#test';

test.describe('QuerySet #child', () => {
    test.beforeEach(setup);

    childTests(([nodes, ...args]) => $(nodes).child(...args).get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const query1 = $('.parent');
            const query2 = query1.child();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('node inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div id="div1"></div><div id="div2"></div>',
                );

                return $(fragment).child('div').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div id="div1"></div><div id="div2"></div>',
                );
                shadow.appendChild(fragment);

                return $(shadow).child('div').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $(document).child('html').get().map((node) => node.id));

            expect(ids).toEqual([
                'html',
            ]);
        });
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet filter', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const query = $('span');

                return $('.parent').child(query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'child3',
                'child7',
            ]);
        });
    });
});
