import { findOneTests } from '#cases/traversal/find/find-one.js';
import { expect, test } from '#test';
import { setupQuery } from '../../../../setup/query.js';

test.describe('QuerySet #findOne', () => {
    test.beforeEach(setupQuery);

    findOneTests((args) => $(document.body).findOne(...args).get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const rootQuery = $(document.body);
            const foundQuery = rootQuery.findOne('#parent1 > #child1 > span, #parent1 > #child2 > span');

            return foundQuery.constructor.name === 'QuerySet' && rootQuery !== foundQuery;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('contexts', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<div id="div1"></div>' +
                    '<div id="div2"></div>');

                return $(fragment).findOne('div').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const host = document.createElement('div');
                const shadowRoot = host.attachShadow({ mode: 'open' });
                const fragment = document.createRange().createContextualFragment('<div id="div1"></div>' +
                    '<div id="div2"></div>');

                shadowRoot.appendChild(fragment);

                return $(shadowRoot).findOne('div').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const doc = new DOMParser().parseFromString('<html>' +
                    '<head></head>' +
                    '<body>' +
                    '<div id="div1"></div>' +
                    '<div id="div2"></div>' +
                    '</body>' +
                    '</html>', 'text/html');

                return $(doc).findOne('div').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
            ]);
        });
    });
});
