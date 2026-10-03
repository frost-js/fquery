import { setup, sortTests } from '#cases/utility/utility/sort.js';
import { expect, test } from '#test';

test.describe('#sort', () => {
    test.beforeEach(setup);

    sortTests((nodes) => $.sort(nodes).map((node) => node.id));

    test('returns nodes sorted by the order they appear in the DOM', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.sort('div').map((node) => node.id))).toEqual([
            'div1',
            'div2',
            'div3',
            'div4',
        ]);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.sort(document.getElementById('div2')).map((node) => node.id))).toEqual([
                'div2',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.sort(document.querySelectorAll('div')).map((node) => node.id))).toEqual([
                'div1',
                'div2',
                'div3',
                'div4',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.sort(document.body.children).map((node) => node.id))).toEqual([
                'div1',
                'div2',
                'div3',
                'div4',
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const fragment = document.createDocumentFragment();
                fragment.id = 'fragment';
                return $.sort(fragment).map((node) => node.id);
            })).toEqual([
                'fragment',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                shadow.id = 'shadow';
                return $.sort(shadow).map((node) => node.id);
            })).toEqual([
                'shadow',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.sort(document).map((node) => node.id))).toEqual([
                'document',
            ]);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.sort(window).map((node) => node.id))).toEqual([
                'window',
            ]);
        });
    });
});
