import { expect, test } from '#test';

test.describe('#findByTag', () => {
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
        const ids = await page.evaluate(() => $.findByTag('span').map((node) => node.id));

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

    test('returns an empty array for non-matching tag', async ({ page }) => {
        const ids = await page.evaluate(() => $.findByTag('invalid').map((node) => node.id));

        expect(ids).toEqual([]);
    });

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate(() => $.findByTag('test', '#invalid').map((node) => node.id));

        expect(ids).toEqual([]);
    });

    test('works with query selector nodes', async ({ page }) => {
        const ids = await page.evaluate(() => $.findByTag('span', '#parent1').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
        ]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.findByTag('span', document.getElementById('parent1')).map((node) => node.id),
        );

        expect(ids).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.findByTag('span', document.querySelectorAll('#parent1')).map((node) => node.id),
        );

        expect(ids).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.findByTag('span', document.getElementById('parent1').children).map((node) => node.id),
        );

        expect(ids).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
        ]);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate(() => {
            const fragment = document.createRange().createContextualFragment('<div id="div1"></div>' +
                '<div id="div2"></div>' +
                '<span id="span1"></span>' +
                '<span id="span2"></span>');

            return $.findByTag('span', fragment).map((node) => node.id);
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

            return $.findByTag('span', shadowRoot).map((node) => node.id);
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

            return $.findByTag('span', doc).map((node) => node.id);
        });

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.findByTag('span', [
                document.getElementById('child1'),
                document.getElementById('child2'),
            ]).map((node) => node.id),
        );

        expect(ids).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
        ]);
    });
});
