import { expect, test } from '#test';

test.describe('QuerySet #findById', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<div id="parent1">' +
                '<div id="child1">' +
                '<span id="test" data-id="span1"></span>' +
                '<span data-id="span2"></span>' +
                '</div>' +
                '<div id="child2">' +
                '<span id="test" data-id="span3"></span>' +
                '<span data-id="span4"></span>' +
                '</div>' +
                '</div>' +
                '<div id="parent2">' +
                '<div id="child3">' +
                '<span id="test" data-id="span5"></span>' +
                '<span data-id="span6"></span>' +
                '</div>' +
                '<div id="child4">' +
                '<span id="test" data-id="span7"></span>' +
                '<span data-id="span8"></span>' +
                '</div>' +
                '</div>';
        });
    });

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

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const rootQuery = $(document.body);
            const foundQuery = rootQuery.findById('test');

            return foundQuery.constructor.name === 'QuerySet' && rootQuery !== foundQuery;
        });

        expect(isNewQuerySet).toBe(true);
    });

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
