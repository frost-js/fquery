import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = `
<div id="parent1">
    <div id="child1">
        <span id="span1" class="test"></span>
        <span id="span2"></span>
    </div>
    <div id="child2">
        <span id="span3" class="test"></span>
        <span id="span4"></span>
    </div>
</div>
<div id="parent2">
    <div id="child3">
        <span id="span5" class="test"></span>
        <span id="span6"></span>
    </div>
    <div id="child4">
        <span id="span7" class="test"></span>
        <span id="span8"></span>
    </div>
</div>
`;

const fragmentMarkup = `
<div id="div1" class="test"></div>
<div id="div2"></div>
<div id="div3" class="test"></div>
<div id="div4"></div>
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

test.describe('#findByClass', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('finds elements by class name', async ({ page }) => {
        const ids = await page.evaluate(() => $.findByClass('test').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span3',
            'span5',
            'span7',
        ]);
    });

    test('finds elements with special characters in the class name', async ({ page }) => {
        expect(await page.evaluate(() => {
            const fragment = document.createDocumentFragment();
            const node = document.createElement('div');
            node.classList.add('test:1');
            fragment.appendChild(node);

            return $.findByClass('test:1', fragment).length;
        })).toBe(1);
    });

    test('returns an empty array for non-matching class', async ({ page }) => {
        const ids = await page.evaluate(() => $.findByClass('invalid').map((node) => node.id));

        expect(ids).toEqual([]);
    });

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate(() => $.findByClass('test', '#invalid').map((node) => node.id));

        expect(ids).toEqual([]);
    });

    test('works with query selector nodes', async ({ page }) => {
        const ids = await page.evaluate(() => $.findByClass('test', '#parent1').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span3',
        ]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.findByClass('test', document.getElementById('parent1')).map((node) => node.id),
        );

        expect(ids).toEqual([
            'span1',
            'span3',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.findByClass('test', document.querySelectorAll('#parent1')).map((node) => node.id),
        );

        expect(ids).toEqual([
            'span1',
            'span3',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.findByClass('test', document.getElementById('parent1').children).map((node) => node.id),
        );

        expect(ids).toEqual([
            'span1',
            'span3',
        ]);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((markup) => {
            const fragment = document.createRange().createContextualFragment(markup);

            return $.findByClass('test', fragment).map((node) => node.id);
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

            return $.findByClass('test', shadowRoot).map((node) => node.id);
        }, fragmentMarkup);

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate((markup) => {
            const doc = new DOMParser().parseFromString(markup, 'text/html');

            return $.findByClass('test', doc).map((node) => node.id);
        }, documentMarkup);

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.findByClass('test', [
                document.getElementById('child1'),
                document.getElementById('child2'),
            ]).map((node) => node.id),
        );

        expect(ids).toEqual([
            'span1',
            'span3',
        ]);
    });
});
