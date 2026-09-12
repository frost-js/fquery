import { isSameTests, setup } from '#cases/utility/tests/is-same.js';
import { expect, test } from '#test';

test.describe('#isSame', () => {
    test.beforeEach(setup);

    isSameTests((args) => $.isSame(...args));

    test.describe('source inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.isSame(document.getElementById('div2'), '#div2, #div4'))).toBe(true);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.isSame(document.querySelectorAll('div'), '#div2, #div4'))).toBe(true);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.isSame(document.body.children, '#div2, #div4'))).toBe(true);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const fragment = document.createDocumentFragment();
                return $.isSame(fragment, [fragment]);
            })).toBe(true);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                return $.isSame(shadow, [shadow]);
            })).toBe(true);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.isSame([
                    document.getElementById('div1'),
                    document.getElementById('div2'),
                    document.getElementById('div3'),
                    document.getElementById('div4'),
                ], '#div2, #div4'))).toBe(true);
        });
    });
});
