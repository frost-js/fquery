import { expect, test } from '#test';

test.describe('QuerySet #findByTag', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<div id="parent1">' +
                '<div id="child1">' +
                '<span id="span1"></span>' +
                '<span id="span2"></span>' +
                '</div>' +
                '<div id="child2">' +
                '<span id="span3"></span>' +
                '<span id="span4"></span>' +
                '</div>' +
                '</div>' +
                '<div id="parent2">' +
                '<div id="child3">' +
                '<span id="span5"></span>' +
                '<span id="span6"></span>' +
                '</div>' +
                '<div id="child4">' +
                '<span id="span7"></span>' +
                '<span id="span8"></span>' +
                '</div>' +
                '</div>';
        });
    });

    test('finds elements by tag name', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $(document.body).findByTag('span').get().map((node) => node.id),
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
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const rootQuery = $(document.body);
            const foundQuery = rootQuery.findByTag('span');

            return foundQuery.constructor.name === 'QuerySet' && rootQuery !== foundQuery;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate(() => {
            const fragment = document.createRange().createContextualFragment('<div id="div1"></div>' +
                '<div id="div2"></div>' +
                '<span id="span1"></span>' +
                '<span id="span2"></span>');

            return $(fragment).findByTag('span').get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'span1',
            'span2',
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

            return $(shadowRoot).findByTag('span').get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'span1',
            'span2',
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

            return $(doc).findByTag('span').get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });
});
