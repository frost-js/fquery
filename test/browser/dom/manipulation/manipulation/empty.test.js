import { emptyTests, setup } from '#cases/manipulation/manipulation/empty.js';
import { expect, test } from '#test';

test.describe('#empty', () => {
    test.beforeEach(setup);

    emptyTests(() => $.empty);

    test.describe('node inputs', () => {
        test('empties nodes with a string content property', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('outer1').content = 'Test 1';

                $.empty('#outer1');
            });

            await expect(page.locator('#outer1')).toHaveCount(1);
            await expect(page.locator('#outer1 > *')).toHaveCount(0);
        });

        test('works with HTMLElement nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $.empty(document.getElementById('outer1'));

                return {
                    bodyChildren: document.body.children.length,
                    outer1Children: document.getElementById('outer1').children.length,
                    outer2Children: document.getElementById('outer2').children.length,
                };
            });

            expect(result).toEqual({
                bodyChildren: 2,
                outer1Children: 0,
                outer2Children: 1,
            });

            await expect(page.locator('#test3')).toHaveCount(1);
            await expect(page.locator('#test4')).toHaveCount(1);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $.empty(document.querySelectorAll('div'));

                return {
                    bodyChildren: document.body.children.length,
                    outer1Children: document.getElementById('outer1').children.length,
                    outer2Children: document.getElementById('outer2').children.length,
                };
            });

            expect(result).toEqual({
                bodyChildren: 2,
                outer1Children: 0,
                outer2Children: 0,
            });
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $.empty(document.body.children);

                return {
                    bodyChildren: document.body.children.length,
                    outer1Children: document.getElementById('outer1').children.length,
                    outer2Children: document.getElementById('outer2').children.length,
                };
            });

            expect(result).toEqual({
                bodyChildren: 2,
                outer1Children: 0,
                outer2Children: 0,
            });
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<div><span></span></div>');

                $.empty(fragment);

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
                $.empty(shadow);

                return shadow.innerHTML;
            });

            expect(shadowHtml).toBe('');
        });

        test('works with Document nodes', async ({ page }) => {
            const childNodeCount = await page.evaluate(() => {
                const doc = new DOMParser().parseFromString('<html></html>', 'text/html');

                $.empty(doc);

                return doc.childNodes.length;
            });

            expect(childNodeCount).toBe(0);
        });

        test('works with array nodes', async ({ page }) => {
            const result = await page.evaluate(() => {
                $.empty([
                    document.getElementById('outer1'),
                    document.getElementById('outer2'),
                ]);

                return {
                    bodyChildren: document.body.children.length,
                    outer1Children: document.getElementById('outer1').children.length,
                    outer2Children: document.getElementById('outer2').children.length,
                };
            });

            expect(result).toEqual({
                bodyChildren: 2,
                outer1Children: 0,
                outer2Children: 0,
            });
        });
    });
});
