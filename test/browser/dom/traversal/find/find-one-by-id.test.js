import { expect, test } from '#test';

test.describe('#findOneById', () => {
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
        const id = await page.evaluate(() => $.findOneById('test')?.dataset.id);

        expect(id).toBe('span1');
    });

    test('returns null for non-matching id', async ({ page }) => {
        const node = await page.evaluate(() => $.findOneById('invalid'));

        expect(node).toBeNull();
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const node = await page.evaluate(() => $.findOneById('test', '#invalid'));

        expect(node).toBeUndefined();
    });

    test('works with query selector nodes', async ({ page }) => {
        const id = await page.evaluate(() => $.findOneById('test', '#parent2')?.dataset.id);

        expect(id).toBe('span5');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const id = await page.evaluate(() =>
            $.findOneById('test', document.getElementById('parent2'))?.dataset.id,
        );

        expect(id).toBe('span5');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const id = await page.evaluate(() =>
            $.findOneById('test', document.querySelectorAll('#parent2'))?.dataset.id,
        );

        expect(id).toBe('span5');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const id = await page.evaluate(() =>
            $.findOneById('test', document.getElementById('parent2').children)?.dataset.id,
        );

        expect(id).toBe('span5');
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const id = await page.evaluate(() => {
            const fragment = document.createRange().createContextualFragment('<div id="test" data-id="div1"></div>' +
                '<div data-id="div2"></div>' +
                '<div id="test" data-id="div3"></div>' +
                '<div data-id="div4"></div>');

            return $.findOneById('test', fragment)?.dataset.id;
        });

        expect(id).toBe('div1');
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const id = await page.evaluate(() => {
            const host = document.createElement('div');
            const shadowRoot = host.attachShadow({ mode: 'open' });
            const fragment = document.createRange().createContextualFragment('<div id="test" data-id="div1"></div>' +
                '<div data-id="div2"></div>' +
                '<div id="test" data-id="div3"></div>' +
                '<div data-id="div4"></div>');

            shadowRoot.appendChild(fragment);

            return $.findOneById('test', shadowRoot)?.dataset.id;
        });

        expect(id).toBe('div1');
    });

    test('works with Document nodes', async ({ page }) => {
        const id = await page.evaluate(() => {
            const doc = new DOMParser().parseFromString('<html>' +
                '<head></head>' +
                '<body>' +
                '<div id="test" data-id="div1"></div>' +
                '<div data-id="div2"></div>' +
                '<div id="test" data-id="div3"></div>' +
                '<div data-id="div4"></div>' +
                '</body>' +
                '</html>', 'text/html');

            return $.findOneById('test', doc)?.dataset.id;
        });

        expect(id).toBe('div1');
    });

    test('works with array nodes', async ({ page }) => {
        const id = await page.evaluate(() =>
            $.findOneById('test', [
                document.getElementById('child3'),
                document.getElementById('child4'),
            ])?.dataset.id,
        );

        expect(id).toBe('span5');
    });
});
