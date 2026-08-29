import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#createComment', () => {
    test('creates a new comment node', async ({ page }) => {
        const commentData = await page.evaluate(() => {
            const comment = $.createComment('Test');

            document.body.appendChild(comment);

            return {
                nodeType: document.body.firstChild.nodeType,
                data: document.body.firstChild.data,
                childNodes: document.body.childNodes.length,
            };
        });

        expect(commentData).toEqual({
            nodeType: 8,
            data: 'Test',
            childNodes: 1,
        });
    });
});
