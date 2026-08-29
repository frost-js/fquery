import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = `
<div id="parent1">
    <div id="child1">
        <span id="span1"></span>
        <span id="span2"></span>
    </div>
    <div id="child2">
        <span id="span3"></span>
        <span id="span4"></span>
    </div>
</div>
<div id="parent2">
    <div id="child3">
        <span id="span5"></span>
        <span id="span6"></span>
    </div>
    <div id="child4">
        <span id="span7"></span>
        <span id="span8"></span>
    </div>
</div>
`;

const fragmentMarkup = `
<div id="div1"></div>
<div id="div2"></div>
<span id="span1"></span>
<span id="span2"></span>
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

test.describe('QuerySet #findOneByTag', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('finds elements by tag name', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $(document.body).findOneByTag('span').get().map((node) => node.id),
        );

        expect(ids).toEqual([
            'span1',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const rootQuery = $(document.body);
            const foundQuery = rootQuery.findOneByTag('span');

            return foundQuery.constructor.name === 'QuerySet' && rootQuery !== foundQuery;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((markup) => {
            const fragment = document.createRange().createContextualFragment(markup);

            return $(fragment).findOneByTag('span').get().map((node) => node.id);
        }, fragmentMarkup);

        expect(ids).toEqual([
            'span1',
        ]);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const ids = await page.evaluate((markup) => {
            const host = document.createElement('div');
            const shadowRoot = host.attachShadow({ mode: 'open' });
            const fragment = document.createRange().createContextualFragment(markup);

            shadowRoot.appendChild(fragment);

            return $(shadowRoot).findOneByTag('span').get().map((node) => node.id);
        }, fragmentMarkup);

        expect(ids).toEqual([
            'span1',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate((markup) => {
            const doc = new DOMParser().parseFromString(markup, 'text/html');

            return $(doc).findOneByTag('span').get().map((node) => node.id);
        }, documentMarkup);

        expect(ids).toEqual([
            'span1',
        ]);
    });
});
