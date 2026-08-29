import { expect, test } from '#test';
import { resetPage } from '../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#loadStyle', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, '<div id="test"></div>');
    });

    test('loads a stylesheet', async ({ page }) => {
        await page.evaluate((_) => {
            $.loadStyle('assets/test.css');
        });

        const link = page.locator('head link');

        await expect(link).toHaveCount(1);
        await expect(link).toHaveAttribute('href', 'assets/test.css');
        await expect(link).toHaveAttribute('rel', 'stylesheet');
    });

    test('loads a stylesheet with attributes', async ({ page }) => {
        await page.evaluate((_) => {
            $.loadStyle('assets/test.css', {
                integrity: 'sha384-92bXn1Q36iY7yWatlPt66wCfjkIltnOTBPgiq2Vf8xM816mhHZfQ1w4JliBw10Fw',
                crossorigin: 'anonymous',
            });
        });

        const link = page.locator('head link');

        await expect(link).toHaveCount(1);
        await expect(link).toHaveAttribute('href', 'assets/test.css');
        await expect(link).toHaveAttribute('rel', 'stylesheet');
        await expect(link).toHaveAttribute('integrity', 'sha384-92bXn1Q36iY7yWatlPt66wCfjkIltnOTBPgiq2Vf8xM816mhHZfQ1w4JliBw10Fw');
        await expect(link).toHaveAttribute('crossorigin', 'anonymous');
    });

    test('loads a stylesheet without cache', async ({ page }) => {
        await page.evaluate((_) => {
            $.loadStyle('assets/test.css', null, { cache: false });
        });

        const link = page.locator('head link');
        const href = await link.getAttribute('href');

        await expect(link).toHaveCount(1);
        expect(href).toMatch(/^assets\/test\.css\?_=\d+$/);
    });

    test('loads a stylesheet without cache (query string)', async ({ page }) => {
        await page.evaluate((_) => {
            $.loadStyle('assets/test.css?test=1', null, { cache: false });
        });

        const link = page.locator('head link');
        const href = await link.getAttribute('href');

        await expect(link).toHaveCount(1);
        expect(href).toMatch(/^assets\/test\.css\?test=1&_=\d+$/);
    });

    test('resolves when the stylesheet is loaded', async ({ page }) => {
        await page.evaluate(async (_) => {
            await $.loadStyle('assets/test.css');
        });

        await expect(page.locator('#test')).toHaveCSS('width', '100px');
    });

    test('throws on error', async ({ page }) => {
        const didThrow = await page.evaluate(async (_) => {
            try {
                await $.loadStyle('assets/error.css');
                return false;
            } catch {
                return true;
            }
        });

        expect(didThrow).toBe(true);
    });
});
