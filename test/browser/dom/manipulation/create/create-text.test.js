import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#createText', () => {
    test('creates a new text node', async ({ page }) => {
        const nodeType = await page.evaluate(() => {
            const textNode = $.createText('Test');

            document.body.appendChild(textNode);

            return document.body.firstChild.nodeType;
        });

        expect(nodeType).toBe(3);
        await expect(page.locator('body')).toHaveText('Test');
    });
});
