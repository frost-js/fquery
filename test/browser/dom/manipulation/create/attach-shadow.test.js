import { attachShadowTests, setup } from '#cases/manipulation/create/attach-shadow.js';
import { expect, test } from '#test';

test.describe('#attachShadow', () => {
    test.beforeEach(setup);

    attachShadowTests((args) => $.attachShadow(...args));

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const hasShadowRoot = await page.evaluate(() => {
                const element = document.getElementById('test');

                $.attachShadow(element);

                return element.shadowRoot instanceof ShadowRoot;
            });

            expect(hasShadowRoot).toBe(true);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const hasShadowRoot = await page.evaluate(() => {
                $.attachShadow(document.querySelectorAll('div'));

                return document.getElementById('test').shadowRoot instanceof ShadowRoot;
            });

            expect(hasShadowRoot).toBe(true);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const hasShadowRoot = await page.evaluate(() => {
                $.attachShadow(document.body.children);

                return document.getElementById('test').shadowRoot instanceof ShadowRoot;
            });

            expect(hasShadowRoot).toBe(true);
        });

        test('works with array nodes', async ({ page }) => {
            const hasShadowRoot = await page.evaluate(() => {
                const element = document.getElementById('test');

                $.attachShadow([element]);

                return element.shadowRoot instanceof ShadowRoot;
            });

            expect(hasShadowRoot).toBe(true);
        });
    });
});
