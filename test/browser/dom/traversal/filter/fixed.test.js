import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="div1"><span id="span1"></span></div><div id="div2" class="test"><span id="span2"></span></div><div id="div3"><span id="span3"></span></div><div id="div4" class="test"><span id="span4"></span></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#fixed', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: '.test { position: fixed; }' });
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns fixed nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.fixed('div').map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('returns descendents of fixed nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.fixed('span').map((node) => node.id));

        expect(ids).toEqual([
            'span2',
            'span4',
        ]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.fixed(document.getElementById('div2')).map((node) => node.id));

        expect(ids).toEqual([
            'div2',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.fixed(document.querySelectorAll('div')).map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.fixed(document.body.children).map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.fixed([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]).map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });
});
