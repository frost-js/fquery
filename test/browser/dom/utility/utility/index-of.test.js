import { indexOfTests, setup } from '#cases/utility/utility/index-of.js';
import { expect, test } from '#test';

test.describe('#indexOf', () => {
    test.beforeEach(setup);

    indexOfTests((args) => $.indexOf(...args));

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.indexOf(document.getElementById('div2'), '.test'))).toBe(0);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.indexOf(document.querySelectorAll('div'), '.test'))).toBe(1);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.indexOf(document.body.children, '.test'))).toBe(1);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const fragment = document.createDocumentFragment();
                return $.indexOf(fragment);
            })).toBe(0);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                return $.indexOf(shadow);
            })).toBe(0);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.indexOf([
                    document.getElementById('div1'),
                    document.getElementById('div2'),
                    document.getElementById('div3'),
                    document.getElementById('div4'),
                ], '.test'))).toBe(1);
        });
    });
});
