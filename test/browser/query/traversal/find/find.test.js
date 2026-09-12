import { expect, test } from '#test';
import { setupQuery } from '../../../../setup/query.js';

test.describe('QuerySet #find', () => {
    test.beforeEach(setupQuery);

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const rootQuery = $(document.body);
            const foundQuery = rootQuery.find('#parent1 > #child1 > span, #parent1 > #child2 > span');

            return foundQuery.constructor.name === 'QuerySet' && rootQuery !== foundQuery;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('selectors', () => {
        test('finds elements by query selector', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $(document.body)
                    .find('#parent1 > #child1 > span, #parent1 > #child2 > span')
                    .get()
                    .map((node) => node.id),
            );

            expect(ids).toEqual([
                'span1',
                'span2',
                'span3',
                'span4',
            ]);
        });

        test('finds elements by ID', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $(document.body).find('#parent1').get().map((node) => node.id),
            );

            expect(ids).toEqual([
                'parent1',
            ]);
        });

        test('finds elements by class name', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $(document.body).find('.span1').get().map((node) => node.id),
            );

            expect(ids).toEqual([
                'span1',
                'span2',
                'span3',
                'span4',
                'span5',
                'span6',
            ]);
        });

        test('finds elements by tag name', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $(document.body).find('span').get().map((node) => node.id),
            );

            expect(ids).toEqual([
                'span1',
                'span2',
                'span3',
                'span4',
                'span5',
                'span6',
                'span7',
                'span8',
                'span9',
                'span10',
                'span11',
                'span12',
            ]);
        });
    });

    test.describe('contexts', () => {
        test('finds descendants of forms with a control named querySelectorAll', async ({ page }) => {
            const names = await page.evaluate(() => {
                document.body.innerHTML = '<form><input name="querySelectorAll"><input name="test"></form>';
                const nodes = $('form').find('input[name]').get();
                return nodes.map((node) => node.name);
            });

            expect(names).toEqual([
                'querySelectorAll',
                'test',
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<div id="div1"></div>' +
                    '<div id="div2"></div>');

                return $(fragment).find('div').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
                'div2',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const host = document.createElement('div');
                const shadowRoot = host.attachShadow({ mode: 'open' });
                const fragment = document.createRange().createContextualFragment('<div id="div1"></div>' +
                    '<div id="div2"></div>');

                shadowRoot.appendChild(fragment);

                return $(shadowRoot).find('div').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
                'div2',
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

                return $(doc).find('div').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
                'div2',
            ]);
        });
    });
});
