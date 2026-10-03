import { setup, visibleTests } from '#cases/traversal/filter/visible.js';
import { expect, test } from '#test';

test.describe('#visible', () => {
    test.beforeEach(setup);

    visibleTests((nodes) => $.visible(nodes).map((node) => node.id));

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.visible(document.getElementById('div1')).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.visible(document.querySelectorAll('div')).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.visible(document.body.children).map((node) => node.id));

        expect(ids).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.visible(document).map((node) => node.id));

        expect(ids).toEqual([
            'document',
        ]);
    });

    test('works with Window nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.visible(window).map((node) => node.id));

        expect(ids).toEqual([
            'window',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.visible([
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
