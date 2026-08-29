import { expect, test } from '#test';
import { resetPage } from '../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#loadScript', () => {
    test('loads a script', async ({ page }) => {
        await page.evaluate((_) => {
            $.loadScript('assets/test.js');
        });

        const script = page.locator('head script');

        await expect(script).toHaveCount(1);
        await expect(script).toHaveAttribute('src', 'assets/test.js');
        await expect(script).toHaveAttribute('type', 'text/javascript');
        expect(await script.getAttribute('async')).toBeNull();
    });

    test('loads a script with attributes', async ({ page }) => {
        await page.evaluate((_) => {
            $.loadScript('assets/test.js', {
                integrity: 'sha384-1AK0oxsmb9+cemh1YwLG4rPfSc3jb81aGOY8CBrD6WNTumSzeeAs3p5iYyXJemZu',
                crossorigin: 'anonymous',
            });
        });

        const script = page.locator('head script');

        await expect(script).toHaveCount(1);
        await expect(script).toHaveAttribute('src', 'assets/test.js');
        await expect(script).toHaveAttribute('type', 'text/javascript');
        await expect(script).toHaveAttribute('integrity', 'sha384-1AK0oxsmb9+cemh1YwLG4rPfSc3jb81aGOY8CBrD6WNTumSzeeAs3p5iYyXJemZu');
        await expect(script).toHaveAttribute('crossorigin', 'anonymous');
    });

    test('loads a script without cache', async ({ page }) => {
        await page.evaluate((_) => {
            $.loadScript('assets/test.js', null, { cache: false });
        });

        const script = page.locator('head script');
        const src = await script.getAttribute('src');

        await expect(script).toHaveCount(1);
        expect(src).toMatch(/^assets\/test\.js\?_=\d+$/);
    });

    test('loads a script without cache (query string)', async ({ page }) => {
        await page.evaluate((_) => {
            $.loadScript('assets/test.js?test=1', null, { cache: false });
        });

        const script = page.locator('head script');
        const src = await script.getAttribute('src');

        await expect(script).toHaveCount(1);
        expect(src).toMatch(/^assets\/test\.js\?test=1&_=\d+$/);
    });

    test('resolves when the script is loaded', async ({ page }) => {
        const data = await page.evaluate(async (_) => {
            await $.loadScript('assets/test.js');
            return window.data;
        });

        expect(data).toBe('Test');
    });

    test('throws on error', async ({ page }) => {
        const didThrow = await page.evaluate(async (_) => {
            try {
                await $.loadScript('assets/error.js');
                return false;
            } catch {
                return true;
            }
        });

        expect(didThrow).toBe(true);
    });
});
