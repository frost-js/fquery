import { childrenTests, setup } from '#cases/traversal/traversal/children.js';
import { expect, test } from '#test';

test.describe('#children', () => {
    test.beforeEach(setup);

    childrenTests((args) => $.children(...args).map((node) => node.id));

    test('returns form children when a control shadows children', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            document.body.innerHTML =
                '<form><input id="test1" name="children"><input id="test2"></form>';
            const nodes = $.children('form');
            return nodes.map((node) => node.id);
        });

        expect(ids).toEqual([
            'test1',
            'test2',
        ]);
    });

    test('returns form child nodes when a control shadows childNodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            document.body.innerHTML =
                '<form><input id="test1"><input id="test2" name="childNodes"></form>';
            const nodes = $.children('form', null, { elementsOnly: false });
            return nodes.map((node) => node.id);
        });

        expect(ids).toEqual([
            'test1',
            'test2',
        ]);
    });

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => $.children('#invalid'));

        expect(ids).toEqual([]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.children(document.getElementById('parent1'), 'span').map((node) => node.id));

        expect(ids).toEqual([
            'child3',
            'child4',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.children(document.querySelectorAll('.parent'), 'span').map((node) => node.id));

        expect(ids).toEqual([
            'child3',
            'child4',
            'child7',
            'child8',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.children(document.body.children, 'span').map((node) => node.id));

        expect(ids).toEqual([
            'child3',
            'child4',
            'child7',
            'child8',
        ]);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div id="div1"></div><div id="div2"></div>',
            );

            return $.children(fragment, 'div').map((node) => node.id);
        });

        expect(ids).toEqual([
            'div1',
            'div2',
        ]);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div id="div1"></div><div id="div2"></div>',
            );
            shadow.appendChild(fragment);

            return $.children(shadow, 'div').map((node) => node.id);
        });

        expect(ids).toEqual([
            'div1',
            'div2',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.children(document, 'html').map((node) => node.id));

        expect(ids).toEqual([
            'html',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.children(
                [
                    document.getElementById('parent1'),
                    document.getElementById('parent2'),
                ],
                'span',
            ).map((node) => node.id));

        expect(ids).toEqual([
            'child3',
            'child4',
            'child7',
            'child8',
        ]);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.children('.parent', (node) => node.tagName === 'SPAN').map((node) => node.id));

        expect(ids).toEqual([
            'child3',
            'child4',
            'child7',
            'child8',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.children('.parent', document.getElementById('child3')).map((node) => node.id));

        expect(ids).toEqual([
            'child3',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.children('.parent', document.querySelectorAll('span')).map((node) => node.id));

        expect(ids).toEqual([
            'child3',
            'child4',
            'child7',
            'child8',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.children('.parent', document.getElementById('parent1').children).map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'child2',
            'child3',
            'child4',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.children('.parent', [
                document.getElementById('child3'),
                document.getElementById('child4'),
                document.getElementById('child7'),
                document.getElementById('child8'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'child3',
            'child4',
            'child7',
            'child8',
        ]);
    });
});
