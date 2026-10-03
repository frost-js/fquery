import { isConnectedTests, setup } from '#cases/utility/tests/is-connected.js';
import { expect, test } from '#test';

test.describe('QuerySet #isConnected', () => {
    test.beforeEach(setup);

    isConnectedTests((nodes) => $(nodes).isConnected());

    test.describe('node inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const fragment = document.createDocumentFragment();
                return $(fragment).isConnected();
            })).toBe(false);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const div = document.getElementById('div1');
                const shadow = div.attachShadow({ mode: 'open' });
                return $(shadow).isConnected();
            })).toBe(true);
        });
    });
});
