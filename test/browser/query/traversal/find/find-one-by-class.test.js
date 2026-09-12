import { expect, test } from '#test';
import { setupFindByClass } from '../../../../setup/find.js';

test.describe('QuerySet #findOneByClass', () => {
    test.beforeEach(setupFindByClass);

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const rootQuery = $(document.body);
            const foundQuery = rootQuery.findOneByClass('test');

            return foundQuery.constructor.name === 'QuerySet' && rootQuery !== foundQuery;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('matching', () => {
        test('finds elements by class name', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $(document.body).findOneByClass('test').get().map((node) => node.id),
            );

            expect(ids).toEqual([
                'span1',
            ]);
        });
    });

    test.describe('contexts', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<div id="div1" class="test"></div>' +
                    '<div id="div2"></div>' +
                    '<div id="div3" class="test"></div>' +
                    '<div id="div4"></div>');

                return $(fragment).findOneByClass('test').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const host = document.createElement('div');
                const shadowRoot = host.attachShadow({ mode: 'open' });
                const fragment = document.createRange().createContextualFragment('<div id="div1" class="test"></div>' +
                    '<div id="div2"></div>' +
                    '<div id="div3" class="test"></div>' +
                    '<div id="div4"></div>');

                shadowRoot.appendChild(fragment);

                return $(shadowRoot).findOneByClass('test').get().map((node) => node.id);
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
                    '<div id="div1" class="test"></div>' +
                    '<div id="div2"></div>' +
                    '<div id="div3" class="test"></div>' +
                    '<div id="div4"></div>' +
                    '</body>' +
                    '</html>', 'text/html');

                return $(doc).findOneByClass('test').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
            ]);
        });
    });
});
