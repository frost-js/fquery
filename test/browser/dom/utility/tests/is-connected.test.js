import { isConnectedTests, setup } from '#cases/utility/tests/is-connected.js';
import { expect, test } from '#test';

test.describe('#isConnected', () => {
    test.beforeEach(setup);

    isConnectedTests((nodes) => $.isConnected(nodes));

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.isConnected(document.getElementById('div1')))).toBe(true);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.isConnected(document.querySelectorAll('div')))).toBe(true);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.isConnected(document.body.children))).toBe(true);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const fragment = document.createDocumentFragment();
                return $.isConnected(fragment);
            })).toBe(false);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const div = document.getElementById('div1');
                const shadow = div.attachShadow({ mode: 'open' });
                return $.isConnected(shadow);
            })).toBe(true);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.isConnected([
                    document.getElementById('div1'),
                    document.getElementById('div2'),
                    document.getElementById('div3'),
                    document.getElementById('div4'),
                ]))).toBe(true);
        });
    });
});
