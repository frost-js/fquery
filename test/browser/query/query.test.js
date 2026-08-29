import { expect, test } from '#test';
import { resetPage } from '../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#query', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="parent1">' +
                '<div id="child1">' +
                '<span id="span1" class="span1 group1">' +
                '<a id="a1" class="group1">' +
                '<strong id="strong1" class="group1"></strong>' +
                '</a>' +
                '<a id="a2" class="group1">' +
                '<strong id="strong2" class="group1"></strong>' +
                '</a>' +
                '<a id="a3" class="group1" data-toggle="test">' +
                '<strong id="strong3" class="group1"></strong>' +
                '</a>' +
                '</span>' +
                '<span id="span2" class="span1 group1">' +
                '<a id="a4" class="group1">' +
                '<strong id="strong4" class="group1"></strong>' +
                '</a>' +
                '<a id="a5" class="group1">' +
                '<strong id="strong5" class="group1"></strong>' +
                '</a>' +
                '<a id="a6" class="group1" data-toggle="test">' +
                '<strong id="strong6" class="group1"></strong>' +
                '</a>' +
                '</span>' +
                '</div>' +
                '<div id="child2">' +
                '<span id="span3" class="span1 group1">' +
                '<a id="a7" class="group1">' +
                '<strong id="strong7" class="group1"></strong>' +
                '</a>' +
                '<a id="a8" class="group1">' +
                '<strong id="strong8" class="group1"></strong>' +
                '</a>' +
                '<a id="a9" class="group1" data-toggle="test">' +
                '<strong id="strong9" class="group1"></strong>' +
                '</a>' +
                '</span>' +
                '<span id="span4" class="span1 group1"></span>' +
                '</div>' +
                '<div id="child3">' +
                '<span id="span5" class="span1 group1"></span>' +
                '<span id="span6" class="span1 group1"></span>' +
                '</div>' +
                '</div>' +
                '<div id="parent2">' +
                '<div id="child4">' +
                '<span id="span7" class="span2 group2">' +
                '<a id="a10" class="group2">' +
                '<strong id="strong10" class="group2"></strong>' +
                '</a>' +
                '<a id="a11" class="group2">' +
                '<strong id="strong11" class="group2"></strong>' +
                '</a>' +
                '<a id="a12" class="group2" data-toggle="test">' +
                '<strong id="strong12" class="group2"></strong>' +
                '</a>' +
                '</span>' +
                '<span id="span8" class="span2 group2">' +
                '<a id="a13" class="group2">' +
                '<strong id="strong13" class="group2"></strong>' +
                '</a>' +
                '<a id="a14" class="group2">' +
                '<strong id="strong14" class="group2"></strong>' +
                '</a>' +
                '<a id="a15" class="group2" data-toggle="test">' +
                '<strong id="strong15" class="group2"></strong>' +
                '</a>' +
                '</span>' +
                '</div>' +
                '<div id="child5">' +
                '<span id="span9" class="span2 group2">' +
                '<a id="a16" class="group2">' +
                '<strong id="strong16" class="group2"></strong>' +
                '</a>' +
                '<a id="a17" class="group2">' +
                '<strong id="strong17" class="group2"></strong>' +
                '</a>' +
                '<a id="a18" class="group2" data-toggle="test">' +
                '<strong id="strong18" class="group2"></strong>' +
                '</a>' +
                '</span>' +
                '<span id="span10" class="span2 group2"></span>' +
                '</div>' +
                '<div id="child6">' +
                '<span id="span11" class="span2 group2"></span>' +
                '<span id="span12" class="span2 group2"></span>' +
                '</div>' +
                '</div>';
        });
    });

    test('executes a callback when ready', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result;
            $((_) => {
                result = true;
            });
            return result;
        })).toBe(true);
    });

    test('finds elements by query selector', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#parent1 > #child1 > span, #parent1 > #child2 > span')
                    .get()
                    .map((node) => node.id))).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
        ]);
    });

    test('finds elements by ID', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#parent1')
                    .get()
                    .map((node) => node.id))).toEqual([
            'parent1',
        ]);
    });

    test('finds elements by class name', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('.span1')
                    .get()
                    .map((node) => node.id))).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
            'span5',
            'span6',
        ]);
    });

    test('finds elements by tag name', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('span')
                    .get()
                    .map((node) => node.id))).toEqual([
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

    test('returns a QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div').constructor.name)).toBe('QuerySet');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(
                document.getElementById('child1'),
            ).get().map((node) => node.id))).toEqual([
            'child1',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(
                document.querySelectorAll('#parent1 > div'),
            ).get().map((node) => node.id))).toEqual([
            'child1',
            'child2',
            'child3',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(
                document.getElementById('parent1').children,
            ).get().map((node) => node.id))).toEqual([
            'child1',
            'child2',
            'child3',
        ]);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const range = document.createRange();
            const fragment = range.createContextualFragment('');
            fragment.id = 'fragment';
            return $(fragment)
                    .get()
                    .map((node) => node.id);
        })).toEqual([
            'fragment',
        ]);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            shadow.id = 'shadow';
            return $(shadow)
                    .get()
                    .map((node) => node.id);
        })).toEqual([
            'shadow',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(document)
                    .get()
                    .map((node) => node.id))).toEqual([
            'document',
        ]);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(window)
                    .get()
                    .map((node) => node.id))).toEqual([
            'window',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $([
                document.getElementById('child1'),
                document.getElementById('child2'),
                document.getElementById('child3'),
            ]).get().map((node) => node.id))).toEqual([
            'child1',
            'child2',
            'child3',
        ]);
    });

    test('works with QuerySet nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('#parent1 > #child1 > span, #parent1 > #child2 > span');
            return $(query)
                    .get()
                    .map((node) => node.id);
        })).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
        ]);
    });

    test('works with HTMLElement context', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(
                'span',
                document.getElementById('child1'),
            ).get().map((node) => node.id))).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('works with NodeList context', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(
                'span',
                document.querySelectorAll('#parent1 > div'),
            ).get().map((node) => node.id))).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
            'span5',
            'span6',
        ]);
    });

    test('works with HTMLCollection context', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(
                'span',
                document.getElementById('parent1').children,
            ).get().map((node) => node.id))).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
            'span5',
            'span6',
        ]);
    });

    test('works with DocumentFragment context', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div id="div1"></div>' +
                    '<div id="div2"></div>',
            );
            return $('div', fragment)
                    .get()
                    .map((node) => node.id);
        })).toEqual([
            'div1',
            'div2',
        ]);
    });

    test('works with ShadowRoot context', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div id="div1"></div>' +
                    '<div id="div2"></div>',
            );
            shadow.appendChild(fragment);
            return $('div', shadow)
                    .get()
                    .map((node) => node.id);
        })).toEqual([
            'div1',
            'div2',
        ]);
    });

    test('works with Document context', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const parser = new DOMParser();
            const myDoc = parser.parseFromString(
                '<html>' +
                    '<head>' +
                    '</head>' +
                    '<body>' +
                    '<div id="div1"></div>' +
                    '<div id="div2"></div>' +
                    '</body>' +
                    '</html>',
                'text/html',
            );
            return $('div', myDoc)
                    .get()
                    .map((node) => node.id);
        })).toEqual([
            'div1',
            'div2',
        ]);
    });

    test('works with array context', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('span', [
                document.getElementById('child1'),
                document.getElementById('child2'),
                document.getElementById('child3'),
            ]).get().map((node) => node.id))).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
            'span5',
            'span6',
        ]);
    });

    test('works with QuerySet context', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('#parent1 > div');
            return $('span', query)
                    .get()
                    .map((node) => node.id);
        })).toEqual([
            'span1',
            'span2',
            'span3',
            'span4',
            'span5',
            'span6',
        ]);
    });
});
