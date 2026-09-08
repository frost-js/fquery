import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="div1" class="test"></div><div id="div2"></div><div id="div3" class="test"></div><div id="div4"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#withCSSTransition', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: '.test { transition: opacity 1s; }' });
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns nodes with CSS transitions', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCSSTransition('div').map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('returns nodes with a later nonzero CSS transition duration', async ({ page }) => {
        await page.addStyleTag({ content: '.test { transition: opacity 0s, transform 1s; }' });

        const ids = await page.evaluate((_) =>
            $.withCSSTransition('div').map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('returns no nodes when all CSS transition durations are zero', async ({ page }) => {
        await page.addStyleTag({ content: '.test { transition: opacity 0s, transform 0s; }' });

        const ids = await page.evaluate((_) =>
            $.withCSSTransition('div').map((node) => node.id));

        expect(ids).toEqual([]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCSSTransition(document.getElementById('div1')).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCSSTransition(document.querySelectorAll('div')).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCSSTransition(document.body.children).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withCSSTransition([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });
});
