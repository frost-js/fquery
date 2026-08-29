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

test.describe('#findOneByClass', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('finds elements by class name', async ({ page }) => {
        const id = await page.evaluate(() => $.findOneByClass('test')?.id);

        expect(id).toBe('span1');
    });

    test('returns null for non-matching class', async ({ page }) => {
        const node = await page.evaluate(() => $.findOneByClass('invalid'));

        expect(node).toBeNull();
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const node = await page.evaluate(() => $.findOneByClass('test', '#invalid'));

        expect(node).toBeUndefined();
    });

    test('works with query selector nodes', async ({ page }) => {
        const id = await page.evaluate(() => $.findOneByClass('test', '#parent2')?.id);

        expect(id).toBe('span5');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const id = await page.evaluate(() =>
            $.findOneByClass('test', document.getElementById('parent2'))?.id,
        );

        expect(id).toBe('span5');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const id = await page.evaluate(() =>
            $.findOneByClass('test', document.querySelectorAll('#parent2'))?.id,
        );

        expect(id).toBe('span5');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const id = await page.evaluate(() =>
            $.findOneByClass('test', document.getElementById('parent2').children)?.id,
        );

        expect(id).toBe('span5');
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const id = await page.evaluate((markup) => {
            const fragment = document.createRange().createContextualFragment(markup);

            return $.findOneByClass('test', fragment)?.id;
        }, fragmentMarkup);

        expect(id).toBe('div1');
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const id = await page.evaluate((markup) => {
            const host = document.createElement('div');
            const shadowRoot = host.attachShadow({ mode: 'open' });
            const fragment = document.createRange().createContextualFragment(markup);

            shadowRoot.appendChild(fragment);

            return $.findOneByClass('test', shadowRoot)?.id;
        }, fragmentMarkup);

        expect(id).toBe('div1');
    });

    test('works with Document nodes', async ({ page }) => {
        const id = await page.evaluate((markup) => {
            const doc = new DOMParser().parseFromString(markup, 'text/html');

            return $.findOneByClass('test', doc)?.id;
        }, documentMarkup);

        expect(id).toBe('div1');
    });

    test('works with array nodes', async ({ page }) => {
        const id = await page.evaluate(() =>
            $.findOneByClass('test', [
                document.getElementById('child3'),
                document.getElementById('child4'),
            ])?.id,
        );

        expect(id).toBe('span5');
    });
});
