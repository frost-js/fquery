import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = `
<div id="parent1">
    <div id="child1">
        <span id="test" data-id="span1"></span>
        <span data-id="span2"></span>
    </div>
    <div id="child2">
        <span id="test" data-id="span3"></span>
        <span data-id="span4"></span>
    </div>
</div>
<div id="parent2">
    <div id="child3">
        <span id="test" data-id="span5"></span>
        <span data-id="span6"></span>
    </div>
    <div id="child4">
        <span id="test" data-id="span7"></span>
        <span data-id="span8"></span>
    </div>
</div>
`;

const fragmentMarkup = `
<div id="test" data-id="div1"></div>
<div data-id="div2"></div>
<div id="test" data-id="div3"></div>
<div data-id="div4"></div>
`;

const documentMarkup = `
<html>
    <head></head>
    <body>
        ${fragmentMarkup}
    </body>
</html>
`;

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#findById', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('finds elements by ID', async ({ page }) => {
        const ids = await page.evaluate(() => $.findById('test').map((node) => node.dataset.id));

        expect(ids).toEqual([
            'span1',
            'span3',
            'span5',
            'span7',
        ]);
    });

    test('finds elements with special characters in the ID', async ({ page }) => {
        expect(await page.evaluate(() => {
            const node = document.createElement('div');
            node.id = 'test:1';
            document.body.appendChild(node);

            return $.findById('test:1').length;
        })).toBe(1);
    });

    test('returns an empty array for non-matching id', async ({ page }) => {
        const ids = await page.evaluate(() => $.findById('invalid').map((node) => node.dataset.id));

        expect(ids).toEqual([]);
    });

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate(() => $.findById('test', '#invalid').map((node) => node.dataset.id));

        expect(ids).toEqual([]);
    });

    test('works with query selector nodes', async ({ page }) => {
        const ids = await page.evaluate(() => $.findById('test', '#parent1').map((node) => node.dataset.id));

        expect(ids).toEqual([
            'span1',
            'span3',
        ]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.findById('test', document.getElementById('parent1')).map((node) => node.dataset.id),
        );

        expect(ids).toEqual([
            'span1',
            'span3',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.findById('test', document.querySelectorAll('#parent1')).map((node) => node.dataset.id),
        );

        expect(ids).toEqual([
            'span1',
            'span3',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.findById('test', document.getElementById('parent1').children).map((node) => node.dataset.id),
        );

        expect(ids).toEqual([
            'span1',
            'span3',
        ]);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((markup) => {
            const fragment = document.createRange().createContextualFragment(markup);

            return $.findById('test', fragment).map((node) => node.dataset.id);
        }, fragmentMarkup);

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const ids = await page.evaluate((markup) => {
            const host = document.createElement('div');
            const shadowRoot = host.attachShadow({ mode: 'open' });
            const fragment = document.createRange().createContextualFragment(markup);

            shadowRoot.appendChild(fragment);

            return $.findById('test', shadowRoot).map((node) => node.dataset.id);
        }, fragmentMarkup);

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate((markup) => {
            const doc = new DOMParser().parseFromString(markup, 'text/html');

            return $.findById('test', doc).map((node) => node.dataset.id);
        }, documentMarkup);

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.findById('test', [
                document.getElementById('child1'),
                document.getElementById('child2'),
            ]).map((node) => node.dataset.id),
        );

        expect(ids).toEqual([
            'span1',
            'span3',
        ]);
    });
});
