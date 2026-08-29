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

test.describe('QuerySet #findOneById', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('finds elements by ID', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $(document.body).findOneById('test').get().map((node) => node.dataset.id),
        );

        expect(ids).toEqual([
            'span1',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const rootQuery = $(document.body);
            const foundQuery = rootQuery.findOneById('test');

            return foundQuery.constructor.name === 'QuerySet' && rootQuery !== foundQuery;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((markup) => {
            const fragment = document.createRange().createContextualFragment(markup);

            return $(fragment).findOneById('test').get().map((node) => node.dataset.id);
        }, fragmentMarkup);

        expect(ids).toEqual([
            'div1',
        ]);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const ids = await page.evaluate((markup) => {
            const host = document.createElement('div');
            const shadowRoot = host.attachShadow({ mode: 'open' });
            const fragment = document.createRange().createContextualFragment(markup);

            shadowRoot.appendChild(fragment);

            return $(shadowRoot).findOneById('test').get().map((node) => node.dataset.id);
        }, fragmentMarkup);

        expect(ids).toEqual([
            'div1',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate((markup) => {
            const doc = new DOMParser().parseFromString(markup, 'text/html');

            return $(doc).findOneById('test').get().map((node) => node.dataset.id);
        }, documentMarkup);

        expect(ids).toEqual([
            'div1',
        ]);
    });
});
