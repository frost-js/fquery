import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const WRAP_HTML =
    '<div id="wrap">' +
    '<div id="parent1">' +
    '<a href="#" id="test1">Test</a>' +
    '<a href="#" id="test2">Test</a>' +
    '</div>' +
    '<div id="parent2">' +
    '<a href="#" id="test3">Test</a>' +
    '<a href="#" id="test4">Test</a>' +
    '</div>' +
    '</div>' +
    '<div id="wrapper">' +
    '<div class="outer">' +
    '<div class="inner"></div>' +
    '</div>' +
    '</div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #wrapInner', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, WRAP_HTML);
    });

    test('wraps contents of each node', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('#wrap > div').wrapInner('.outer');

            return document.body.innerHTML;
        });

        expect(html).toBe('<div id="wrap">' +
            '<div id="parent1">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="parent2">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '</div>' +
            '</div>' +
            '</div>');
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsQuery = await page.evaluate(() => {
            const query = $('#wrap > div');

            return query === query.wrapInner('.outer');
        });

        expect(returnsQuery).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const html = await page.evaluate(() => {
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div><span></span></div>' +
                    '<div><span></span></div>',
            );

            $(fragment).wrapInner('.outer');
            document.body.appendChild(fragment);

            return document.body.innerHTML;
        });

        expect(html).toBe('<div id="wrap">' +
            '<div id="parent1">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '<div id="parent2">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<div><span></span></div>' +
            '<div><span></span></div>' +
            '</div>' +
            '</div>');
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const html = await page.evaluate(() => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div><span></span></div>' +
                    '<div><span></span></div>',
            );

            shadow.appendChild(fragment);
            $(shadow).wrapInner('.outer');

            return shadow.innerHTML;
        });

        expect(html).toBe('<div class="outer">' +
            '<div class="inner">' +
            '<div><span></span></div>' +
            '<div><span></span></div>' +
            '</div>' +
            '</div>');
    });

    test('works with HTMLElement other nodes', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('#wrap > div').wrapInner(
                document.querySelector('.outer'),
            );

            return document.body.innerHTML;
        });

        expect(html).toBe('<div id="wrap">' +
            '<div id="parent1">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="parent2">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '</div>' +
            '</div>' +
            '</div>');
    });

    test('works with NodeList other nodes', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('#wrap > div').wrapInner(
                document.querySelectorAll('.outer'),
            );

            return document.body.innerHTML;
        });

        expect(html).toBe('<div id="wrap">' +
            '<div id="parent1">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="parent2">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '</div>' +
            '</div>' +
            '</div>');
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('#wrap > div').wrapInner(
                document.getElementById('wrapper').children,
            );

            return document.body.innerHTML;
        });

        expect(html).toBe('<div id="wrap">' +
            '<div id="parent1">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="parent2">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '</div>' +
            '</div>' +
            '</div>');
    });

    test('works with DocumentFragment other nodes', async ({ page }) => {
        const html = await page.evaluate(() => {
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div><span></span></div>',
            );

            $('#wrap > div').wrapInner(fragment);

            return document.body.innerHTML;
        });

        expect(html).toBe('<div id="wrap">' +
            '<div id="parent1">' +
            '<div>' +
            '<span>' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '<div id="parent2">' +
            '<div>' +
            '<span>' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '</div>' +
            '</div>' +
            '</div>');
    });

    test('works with array other nodes', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('#wrap > div').wrapInner([
                document.querySelector('.outer'),
            ]);

            return document.body.innerHTML;
        });

        expect(html).toBe('<div id="wrap">' +
            '<div id="parent1">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="parent2">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '</div>' +
            '</div>' +
            '</div>');
    });

    test('works with HTML other nodes', async ({ page }) => {
        const html = await page.evaluate(() => {
            $('#wrap > div').wrapInner('<div class="div-outer"><span class="span-inner"></span></div>');

            return document.body.innerHTML;
        });

        expect(html).toBe('<div id="wrap">' +
            '<div id="parent1">' +
            '<div class="div-outer">' +
            '<span class="span-inner">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '<div id="parent2">' +
            '<div class="div-outer">' +
            '<span class="span-inner">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="wrapper">' +
            '<div class="outer">' +
            '<div class="inner">' +
            '</div>' +
            '</div>' +
            '</div>');
    });
});
