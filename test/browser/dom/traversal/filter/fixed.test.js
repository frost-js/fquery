import { fixedTests, setup } from '#cases/traversal/filter/fixed.js';
import { expect, test } from '#test';

test.describe('#fixed', () => {
    test.beforeEach(setup);

    fixedTests((nodes) => $.fixed(nodes).map((node) => node.id));

    test('works with HTMLElement nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.fixed(document.getElementById('div2')).map((node) => node.id));

        expect(ids).toEqual([
            'div2',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.fixed(document.querySelectorAll('div')).map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.fixed(document.body.children).map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
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
