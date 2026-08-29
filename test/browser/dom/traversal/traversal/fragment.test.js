import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<template id="template1"></template><template id="template2"></template><div id="div1"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#fragment', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the document fragment of the first node', async ({ page }) => {
        const hasFragment = await page.evaluate((_) => {
            const fragment = $.fragment('template');

            return fragment instanceof DocumentFragment;
        });

        expect(hasFragment).toBe(true);
    });

    test('returns undefined for nodes without a fragment', async ({ page }) => {
        const fragment = await page.evaluate((_) => $.fragment('#div1'));

        expect(fragment).toBe(undefined);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const fragment = await page.evaluate((_) => $.fragment('#invalid'));

        expect(fragment).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const hasFragment = await page.evaluate((_) => {
            const fragment = $.fragment(
                document.getElementById('template1'),
            );

            return fragment instanceof DocumentFragment;
        });

        expect(hasFragment).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const hasFragment = await page.evaluate((_) => {
            const fragment = $.fragment(
                document.querySelectorAll('template'),
            );

            return fragment instanceof DocumentFragment;
        });

        expect(hasFragment).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const hasFragment = await page.evaluate((_) => {
            const fragment = $.fragment(document.body.children);

            return fragment instanceof DocumentFragment;
        });

        expect(hasFragment).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        const hasFragment = await page.evaluate((_) => {
            const fragment = $.fragment([
                document.getElementById('template1'),
                document.getElementById('template2'),
            ]);

            return fragment instanceof DocumentFragment;
        });

        expect(hasFragment).toBe(true);
    });
});
