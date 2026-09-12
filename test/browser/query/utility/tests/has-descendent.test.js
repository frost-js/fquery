import { hasDescendentTests, setup } from '#cases/utility/tests/has-descendent.js';
import { expect, test } from '#test';

test.describe('QuerySet #hasDescendent', () => {
    test.beforeEach(setup);

    hasDescendentTests(([nodes, ...args]) => $(nodes).hasDescendent(...args));

    test.describe('node inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div></div>',
                );
                return $(fragment).hasDescendent('div');
            })).toBe(true);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div></div>',
                );
                shadow.appendChild(fragment);
                return $(shadow).hasDescendent('div');
            })).toBe(true);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $(document).hasDescendent('div'))).toBe(true);
        });
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet filter', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const query = $('a');
                return $('div').hasDescendent(query);
            })).toBe(true);
        });
    });
});
