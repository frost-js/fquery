import { expect, test } from '#test';
import { setupFindByTag } from '../../../../setup/find.js';

test.describe('QuerySet #findOneByTag', () => {
    test.beforeEach(setupFindByTag);

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const rootQuery = $(document.body);
            const foundQuery = rootQuery.findOneByTag('span');

            return foundQuery.constructor.name === 'QuerySet' && rootQuery !== foundQuery;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('matching', () => {
        test('finds elements by tag name', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $(document.body).findOneByTag('span').get().map((node) => node.id),
            );

            expect(ids).toEqual([
                'span1',
            ]);
        });
    });

    test.describe('contexts', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<div id="div1"></div>' +
                    '<div id="div2"></div>' +
                    '<span id="span1"></span>' +
                    '<span id="span2"></span>');

                return $(fragment).findOneByTag('span').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'span1',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const host = document.createElement('div');
                const shadowRoot = host.attachShadow({ mode: 'open' });
                const fragment = document.createRange().createContextualFragment('<div id="div1"></div>' +
                    '<div id="div2"></div>' +
                    '<span id="span1"></span>' +
                    '<span id="span2"></span>');

                shadowRoot.appendChild(fragment);

                return $(shadowRoot).findOneByTag('span').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'span1',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const doc = new DOMParser().parseFromString('<html>' +
                    '<head></head>' +
                    '<body>' +
                    '<div id="div1"></div>' +
                    '<div id="div2"></div>' +
                    '<span id="span1"></span>' +
                    '<span id="span2"></span>' +
                    '</body>' +
                    '</html>', 'text/html');

                return $(doc).findOneByTag('span').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'span1',
            ]);
        });
    });
});
