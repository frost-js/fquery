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

test.describe('#findOneByTag', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('finds elements by tag name', async ({ page }) => {
        const id = await page.evaluate(() => $.findOneByTag('span')?.id);

        expect(id).toBe('span1');
    });

    test('returns null for non-matching tag', async ({ page }) => {
        const node = await page.evaluate(() => $.findOneByTag('invalid'));

        expect(node).toBeNull();
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const node = await page.evaluate(() => $.findOneByTag('span', '#invalid'));

        expect(node).toBeUndefined();
    });

    test('works with query selector nodes', async ({ page }) => {
        const id = await page.evaluate(() => $.findOneByTag('span', '#parent2')?.id);

        expect(id).toBe('span5');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const id = await page.evaluate(() =>
            $.findOneByTag('span', document.getElementById('parent2'))?.id,
        );

        expect(id).toBe('span5');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const id = await page.evaluate(() =>
            $.findOneByTag('span', document.querySelectorAll('#parent2'))?.id,
        );

        expect(id).toBe('span5');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const id = await page.evaluate(() =>
            $.findOneByTag('span', document.getElementById('parent2').children)?.id,
        );

        expect(id).toBe('span5');
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const id = await page.evaluate((markup) => {
            const fragment = document.createRange().createContextualFragment(markup);

            return $.findOneByTag('span', fragment)?.id;
        }, fragmentMarkup);

        expect(id).toBe('span1');
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const id = await page.evaluate((markup) => {
            const host = document.createElement('div');
            const shadowRoot = host.attachShadow({ mode: 'open' });
            const fragment = document.createRange().createContextualFragment(markup);

            shadowRoot.appendChild(fragment);

            return $.findOneByTag('span', shadowRoot)?.id;
        }, fragmentMarkup);

        expect(id).toBe('span1');
    });

    test('works with Document nodes', async ({ page }) => {
        const id = await page.evaluate((markup) => {
            const doc = new DOMParser().parseFromString(markup, 'text/html');

            return $.findOneByTag('span', doc)?.id;
        }, documentMarkup);

        expect(id).toBe('span1');
    });

    test('works with array nodes', async ({ page }) => {
        const id = await page.evaluate(() =>
            $.findOneByTag('span', [
                document.getElementById('child3'),
                document.getElementById('child4'),
            ])?.id,
        );

        expect(id).toBe('span5');
    });
});
