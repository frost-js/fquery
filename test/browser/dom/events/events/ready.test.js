import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#ready', () => {
    test('executes a callback when ready', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result;
            $.ready((_) => {
                result = true;
            });
            return result;
        })).toBe(true);
    });

    test('executes a callback when the document is interactive', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = {
                nodeType: Node.DOCUMENT_NODE,
                readyState: 'interactive',
            };
            let result = false;

            $.setContext(myDoc);
            $.ready((_) => {
                result = true;
            });

            return result;
        })).toBe(true);
    });
});
