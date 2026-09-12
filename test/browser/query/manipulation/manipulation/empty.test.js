import { emptyTests, setup } from '#cases/manipulation/manipulation/empty.js';
import { expect, test } from '#test';

test.describe('QuerySet #empty', () => {
    test.beforeEach(setup);

    emptyTests(() => (nodes, ...args) => {
        $(nodes).empty(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsSameQuery = await page.evaluate(() => {
            const query = $('a');

            return query === query.empty();
        });

        expect(returnsSameQuery).toBe(true);
    });

    test.describe('node inputs', () => {
        test('empties nodes with a string content property', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('outer1').content = 'Test 1';

                $('#outer1').empty();
            });

            await expect(page.locator('#outer1')).toHaveCount(1);
            await expect(page.locator('#outer1 > *')).toHaveCount(0);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<div><span></span></div>');

                $(fragment).empty();

                return {
                    childNodes: fragment.childNodes.length,
                    firstChildChildren: fragment.firstChild?.childNodes.length ?? null,
                };
            });

            expect(result).toEqual({
                childNodes: 0,
                firstChildChildren: null,
            });
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const shadowHtml = await page.evaluate(() => {
                const host = document.createElement('div');
                const shadow = host.attachShadow({ mode: 'open' });

                shadow.appendChild(document.createRange().createContextualFragment('<div><span></span></div>'));
                $(shadow).empty();

                return shadow.innerHTML;
            });

            expect(shadowHtml).toBe('');
        });

        test('works with Document nodes', async ({ page }) => {
            const childNodeCount = await page.evaluate(() => {
                const doc = new DOMParser().parseFromString('<html></html>', 'text/html');

                $(doc).empty();

                return doc.childNodes.length;
            });

            expect(childNodeCount).toBe(0);
        });
    });
});
