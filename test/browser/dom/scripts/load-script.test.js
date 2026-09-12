import { expect, test } from '#test';

test.describe('#loadScript', () => {
    test.describe('attributes', () => {
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
    });

    test.describe('cache behavior', () => {
        for (const [name, url, expected] of [
            [
                'without a query string',
                'assets/test.js',
                /^http:\/\/localhost:3001\/assets\/test\.js\?_=\d+$/,
            ],
            [
                'with an existing query string',
                'assets/test.js?test=1',
                /^http:\/\/localhost:3001\/assets\/test\.js\?test=1&_=\d+$/,
            ],
        ]) {
            test(`loads a script without cache ${name}`, async ({ page }) => {
                await page.evaluate((url) => {
                    $.loadScript(url, null, { cache: false });
                }, url);

                const script = page.locator('head script');
                const src = await script.getAttribute('src');

                await expect(script).toHaveCount(1);
                expect(src).toMatch(expected);
            });
        }
    });

    test.describe('contexts', () => {
        test('loads a script without cache using the document base URL', async ({ page }) => {
            await page.evaluate((_) => {
                document.head.innerHTML = '<base href="/assets/">';
                $.loadScript('test.js?test=1', null, { cache: false });
            });

            const script = page.locator('head script');
            const src = await script.getAttribute('src');

            await expect(script).toHaveCount(1);
            expect(src).toMatch(/^http:\/\/localhost:3001\/assets\/test\.js\?test=1&_=\d+$/);
        });

        test('loads a script without cache in a context with a different base URL', async ({ page }) => {
            await page.evaluate((_) => {
                const iframe = document.createElement('iframe');
                document.body.appendChild(iframe);
                const context = iframe.contentDocument;
                context.head.innerHTML = '<base href="http://localhost:3001/assets/">';
                $.loadScript('test.js?test=1', null, { cache: false, context });
            });

            const script = page.frameLocator('iframe').locator('head script');
            const src = await script.getAttribute('src');

            await expect(script).toHaveCount(1);
            expect(src).toMatch(/^http:\/\/localhost:3001\/assets\/test\.js\?test=1&_=\d+$/);
        });
    });

    test.describe('completion', () => {
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
});
