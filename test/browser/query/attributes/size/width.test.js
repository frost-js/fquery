import { setup, widthTests } from '#cases/attributes/size/width.js';
import { expect, test } from '#test';

test.describe('QuerySet #width', () => {
    test.beforeEach(setup);

    widthTests(([nodes, ...args]) => $(nodes).width(...args));

    test.describe('node inputs', () => {
        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $(document).width())).toBe(800);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $(window).width())).toBe(800);
        });
    });
});
