import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = `
<div id="parent1">
    <div id="child1">
        <span id="span1" class="span1 group1">
            <a id="a1" class="group1">
                <strong id="strong1" class="group1"></strong>
            </a>
            <a id="a2" class="group1">
                <strong id="strong2" class="group1"></strong>
            </a>
            <a id="a3" class="group1" data-toggle="test">
                <strong id="strong3" class="group1"></strong>
            </a>
        </span>
        <span id="span2" class="span1 group1">
            <a id="a4" class="group1">
                <strong id="strong4" class="group1"></strong>
            </a>
            <a id="a5" class="group1">
                <strong id="strong5" class="group1"></strong>
            </a>
            <a id="a6" class="group1" data-toggle="test">
                <strong id="strong6" class="group1"></strong>
            </a>
        </span>
    </div>
    <div id="child2">
        <span id="span3" class="span1 group1">
            <a id="a7" class="group1">
                <strong id="strong7" class="group1"></strong>
            </a>
            <a id="a8" class="group1">
                <strong id="strong8" class="group1"></strong>
            </a>
            <a id="a9" class="group1" data-toggle="test">
                <strong id="strong9" class="group1"></strong>
            </a>
        </span>
        <span id="span4" class="span1 group1"></span>
    </div>
    <div id="child3">
        <span id="span5" class="span1 group1"></span>
        <span id="span6" class="span1 group1"></span>
    </div>
</div>
<div id="parent2">
    <div id="child4">
        <span id="span7" class="span2 group2">
            <a id="a10" class="group2">
                <strong id="strong10" class="group2"></strong>
            </a>
            <a id="a11" class="group2">
                <strong id="strong11" class="group2"></strong>
            </a>
            <a id="a12" class="group2" data-toggle="test">
                <strong id="strong12" class="group2"></strong>
            </a>
        </span>
        <span id="span8" class="span2 group2">
            <a id="a13" class="group2">
                <strong id="strong13" class="group2"></strong>
            </a>
            <a id="a14" class="group2">
                <strong id="strong14" class="group2"></strong>
            </a>
            <a id="a15" class="group2" data-toggle="test">
                <strong id="strong15" class="group2"></strong>
            </a>
        </span>
    </div>
    <div id="child5">
        <span id="span9" class="span2 group2">
            <a id="a16" class="group2">
                <strong id="strong16" class="group2"></strong>
            </a>
            <a id="a17" class="group2">
                <strong id="strong17" class="group2"></strong>
            </a>
            <a id="a18" class="group2" data-toggle="test">
                <strong id="strong18" class="group2"></strong>
            </a>
        </span>
        <span id="span10" class="span2 group2"></span>
    </div>
    <div id="child6">
        <span id="span11" class="span2 group2"></span>
        <span id="span12" class="span2 group2"></span>
    </div>
</div>
`;

const fragmentMarkup = `
<div id="div1"></div>
<div id="div2"></div>
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

test.describe('#find', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('finds elements by query selector', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.find('#parent1 > #child1 > span, #parent1 > #child2 > span').map((node) => node.id),
        );

        expect(ids).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
        ]);
    });

    test('finds elements by ID', async ({ page }) => {
        const ids = await page.evaluate(() => $.find('#parent1').map((node) => node.id));

        expect(ids).toEqual([
            'parent1',
        ]);
    });

    test('finds elements by class name', async ({ page }) => {
        const ids = await page.evaluate(() => $.find('.span1').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
            'span5',
            'span6',
        ]);
    });

    test('finds elements by tag name', async ({ page }) => {
        const ids = await page.evaluate(() => $.find('span').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
            'span5',
            'span6',
            'span7',
            'span8',
            'span9',
            'span10',
            'span11',
            'span12',
        ]);
    });

    test('returns an empty array for non-matching selector', async ({ page }) => {
        const ids = await page.evaluate(() => $.find('#invalid').map((node) => node.id));

        expect(ids).toEqual([]);
    });

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate(() => $.find('span', '#invalid').map((node) => node.id));

        expect(ids).toEqual([]);
    });

    test('works with query selector nodes', async ({ page }) => {
        const ids = await page.evaluate(() => $.find('span', '#parent1 > #child1').map((node) => node.id));

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.find('span', document.getElementById('child1')).map((node) => node.id),
        );

        expect(ids).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.find('span', document.querySelectorAll('#parent1 > div')).map((node) => node.id),
        );

        expect(ids).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
            'span5',
            'span6',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.find('span', document.getElementById('parent1').children).map((node) => node.id),
        );

        expect(ids).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
            'span5',
            'span6',
        ]);
    });

    test('works with collections from another window', async ({ page }) => {
        expect(await page.evaluate(() => {
            const iframe = document.createElement('iframe');
            document.body.appendChild(iframe);

            const context = iframe.contentDocument;
            context.body.innerHTML = '<div><span></span></div>';

            return [
                $.find('span', context.querySelectorAll('div')).length,
                $.find('span', context.body.children).length,
            ];
        })).toEqual([1, 1]);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((markup) => {
            const fragment = document.createRange().createContextualFragment(markup);

            return $.find('div', fragment).map((node) => node.id);
        }, fragmentMarkup);

        expect(ids).toEqual([
            'div1',
            'div2',
        ]);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const ids = await page.evaluate((markup) => {
            const host = document.createElement('div');
            const shadowRoot = host.attachShadow({ mode: 'open' });
            const fragment = document.createRange().createContextualFragment(markup);

            shadowRoot.appendChild(fragment);

            return $.find('div', shadowRoot).map((node) => node.id);
        }, fragmentMarkup);

        expect(ids).toEqual([
            'div1',
            'div2',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate((markup) => {
            const doc = new DOMParser().parseFromString(markup, 'text/html');

            return $.find('div', doc).map((node) => node.id);
        }, documentMarkup);

        expect(ids).toEqual([
            'div1',
            'div2',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.find('span', [
                document.getElementById('child4'),
                document.getElementById('child5'),
                document.getElementById('child6'),
            ]).map((node) => node.id),
        );

        expect(ids).toEqual([
            'span7',
            'span8',
            'span9',
            'span10',
            'span11',
            'span12',
        ]);
    });
});
