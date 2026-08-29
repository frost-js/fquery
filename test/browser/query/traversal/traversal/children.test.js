import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1" class="parent"><div id="child1"><span></span></div><div id="child2"><span></span></div><span id="child3"><span></span></span><span id="child4"><span></span></span></div><div id="parent2" class="parent"><div id="child5"><span></span></div><div id="child6"><span></span></div><span id="child7"><span></span></span><span id="child8"><span></span></span></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #children', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns all children of each node', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.parent').children().get().map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'child2',
            'child3',
            'child4',
            'child5',
            'child6',
            'child7',
            'child8',
        ]);
    });

    test('returns all children of each node matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.parent').children('span').get().map((node) => node.id));

        expect(ids).toEqual([
            'child3',
            'child4',
            'child7',
            'child8',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('.parent');
            const query2 = query1.children();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div id="div1"></div><div id="div2"></div>',
            );

            return $(fragment).children('div').get().map((node) => node.id);
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

            return $(shadow).children('div').get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'div1',
            'div2',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $(document).children('html').get().map((node) => node.id));

        expect(ids).toEqual([
            'html',
        ]);
    });

    test('works with function filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.parent').children((node) => node.tagName === 'SPAN').get().map((node) => node.id));

        expect(ids).toEqual([
            'child3',
            'child4',
            'child7',
            'child8',
        ]);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.parent').children(document.getElementById('child3')).get().map((node) => node.id));

        expect(ids).toEqual([
            'child3',
        ]);
    });

    test('works with NodeList filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.parent').children(document.querySelectorAll('span')).get().map((node) => node.id));

        expect(ids).toEqual([
            'child3',
            'child4',
            'child7',
            'child8',
        ]);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.parent').children(document.getElementById('parent1').children).get().map((node) => node.id));

        expect(ids).toEqual([
            'child1',
            'child2',
            'child3',
            'child4',
        ]);
    });

    test('works with array filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('.parent')
                .children([
                    document.getElementById('child3'),
                    document.getElementById('child4'),
                    document.getElementById('child7'),
                    document.getElementById('child8'),
                ])
                .get()
                .map((node) => node.id));

        expect(ids).toEqual([
            'child3',
            'child4',
            'child7',
            'child8',
        ]);
    });

    test('works with QuerySet filter', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const query = $('span');

            return $('.parent').children(query).get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'child3',
            'child4',
            'child7',
            'child8',
        ]);
    });
});
