import { expect, test } from '#test';

test.describe('#ready', () => {
    test('executes a callback when ready', async ({ page }) => {
        expect(await page.evaluate(() => {
            let result;
            $.ready(() => {
                result = true;
            });
            return result;
        })).toBe(true);
    });

    test('executes a callback when the document is interactive', async ({ page }) => {
        expect(await page.evaluate(() => {
            const myDoc = {
                nodeType: Node.DOCUMENT_NODE,
                readyState: 'interactive',
            };
            let result = false;

            $.setContext(myDoc);
            $.ready(() => {
                result = true;
            });

            return result;
        })).toBe(true);
    });
});
