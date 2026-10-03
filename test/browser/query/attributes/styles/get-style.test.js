import { getStyleTests, setup } from '#cases/attributes/styles/get-style.js';
import { expect, test } from '#test';

test.describe('QuerySet #getStyle', () => {
    test.beforeEach(setup);

    getStyleTests(([nodes, ...args]) => $(nodes).getStyle(...args));

    test('returns an object with all style values for the first node', async ({ page }) => {
        expect(await page.evaluate(() =>
            $('div').getStyle())).toEqual({
            display: 'block',
            width: '100px',
            height: '100px',
        });
    });
});
