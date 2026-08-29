import { expect, test } from '#test';
import { resetPage } from '../../../setup/browser.js';

const markup = `
<div id="div1">
    <span id="span1"></span>
</div>
<div id="div2">
    <span id="span2"></span>
</div>
`;

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#parseHTML', () => {
    test('returns an array of nodes parsed from a HTML string', async ({ page }) => {
        await page.evaluate((html) => {
            const nodes = $.parseHTML(html);

            for (const node of nodes) {
                document.body.appendChild(node);
            }
        }, markup);

        await expect(page.locator('body > div')).toHaveCount(2);
        await expect(page.locator('#div1 > #span1')).toHaveCount(1);
        await expect(page.locator('#div2 > #span2')).toHaveCount(1);
    });
});
