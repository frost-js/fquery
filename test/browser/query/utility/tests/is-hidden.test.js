import { isHiddenTests, setup } from '#cases/utility/tests/is-hidden.js';
import { expect, test } from '#test';

test.describe('QuerySet #isHidden', () => {
    test.beforeEach(setup);

    isHiddenTests((nodes) => $(nodes).isHidden());

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = new Document();
            return $(myDoc)
                    .isHidden();
        })).toBe(true);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myWindow = {
                document: {},
                id: 'window',
            };
            myWindow.document.defaultView = myWindow;
            return $(myWindow)
                    .isHidden();
        })).toBe(true);
    });
});
