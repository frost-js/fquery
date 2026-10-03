import { isTests, setup } from '#cases/utility/tests/is.js';
import { expect, test } from '#test';

test.describe('#is', () => {
    test.beforeEach(setup);

    isTests((args) => $.is(...args));

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.is(document.getElementById('div1'), '.test'))).toBe(true);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.is(document.querySelectorAll('div'), '.test'))).toBe(true);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.is(document.body.children, '.test'))).toBe(true);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const fragment = document.createDocumentFragment();
                return $.is(fragment);
            })).toBe(true);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                return $.is(shadow);
            })).toBe(true);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.is([
                    document.getElementById('div1'),
                    document.getElementById('div2'),
                    document.getElementById('div3'),
                    document.getElementById('div4'),
                ], '.test'))).toBe(true);
        });
    });
});
