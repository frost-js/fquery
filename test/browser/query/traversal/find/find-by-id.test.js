import { expect, test } from '#test';
import { setupFindById } from '../../../../setup/find.js';

test.describe('QuerySet #findById', () => {
    test.beforeEach(setupFindById);

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const rootQuery = $(document.body);
            const foundQuery = rootQuery.findById('test');

            return foundQuery.constructor.name === 'QuerySet' && rootQuery !== foundQuery;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('matching', () => {
        test('finds elements by ID', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $(document.body).findById('test').get().map((node) => node.dataset.id),
            );

            expect(ids).toEqual([
                'span1',
                'span3',
                'span5',
                'span7',
            ]);
        });
    });

    test.describe('contexts', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<div id="test" data-id="div1"></div>' +
                    '<div data-id="div2"></div>' +
                    '<div id="test" data-id="div3"></div>' +
                    '<div data-id="div4"></div>');

                return $(fragment).findById('test').get().map((node) => node.dataset.id);
            });

            expect(ids).toEqual([
                'div1',
                'div3',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const host = document.createElement('div');
                const shadowRoot = host.attachShadow({ mode: 'open' });
                const fragment = document.createRange().createContextualFragment('<div id="test" data-id="div1"></div>' +
                    '<div data-id="div2"></div>' +
                    '<div id="test" data-id="div3"></div>' +
                    '<div data-id="div4"></div>');

                shadowRoot.appendChild(fragment);

                return $(shadowRoot).findById('test').get().map((node) => node.dataset.id);
            });

            expect(ids).toEqual([
                'div1',
                'div3',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const doc = new DOMParser().parseFromString('<html>' +
                    '<head></head>' +
                    '<body>' +
                    '<div id="test" data-id="div1"></div>' +
                    '<div data-id="div2"></div>' +
                    '<div id="test" data-id="div3"></div>' +
                    '<div data-id="div4"></div>' +
                    '</body>' +
                    '</html>', 'text/html');

                return $(doc).findById('test').get().map((node) => node.dataset.id);
            });

            expect(ids).toEqual([
                'div1',
                'div3',
            ]);
        });
    });
});
