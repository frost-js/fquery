import { hasChildrenTests, setup } from '#cases/utility/tests/has-children.js';
import { expect, test } from '#test';

test.describe('QuerySet #hasChildren', () => {
    test.beforeEach(setup);

    hasChildrenTests((nodes) => $(nodes).hasChildren());

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate(() => {
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div></div>',
            );
            return $(fragment).hasChildren();
        })).toBe(true);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate(() => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div></div>',
            );
            shadow.appendChild(fragment);
            return $(shadow).hasChildren();
        })).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $(document).hasChildren())).toBe(true);
    });
});
