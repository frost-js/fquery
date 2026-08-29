import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#createFragment', () => {
    test('creates a new document fragment', async ({ page }) => {
        const result = await page.evaluate(() => {
            const fragment = $.createFragment();
            const span = document.createElement('span');

            fragment.appendChild(span);
            document.body.appendChild(fragment);

            return {
                isFragment: fragment instanceof DocumentFragment,
                childCount: document.body.children.length,
                firstTag: document.body.firstElementChild.tagName.toLowerCase(),
            };
        });

        expect(result).toEqual({
            isFragment: true,
            childCount: 1,
            firstTag: 'span',
        });
    });
});
