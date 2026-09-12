import { heightTests, setup } from '#cases/attributes/size/height.js';
import { expect, test } from '#test';

test.describe('QuerySet #height', () => {
    test.beforeEach(setup);

    heightTests(([nodes, ...args]) => $(nodes).height(...args));

    test.describe('node inputs', () => {
        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $(document).height())).toBe(1152);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $(window).height())).toBe(600);
        });
    });
});
