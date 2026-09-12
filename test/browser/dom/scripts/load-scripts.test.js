import { expect, test } from '#test';

test.describe('#loadScripts', () => {
    test.describe('attributes', () => {
        test('loads scripts', async ({ page }) => {
            await page.evaluate((_) => {
                $.loadScripts([
                    'assets/test.js',
                    'assets/test2.js',
                ]);
            });

            const scripts = page.locator('head script');
            const first = scripts.nth(0);
            const second = scripts.nth(1);

            await expect(scripts).toHaveCount(2);
            await expect(first).toHaveAttribute('src', 'assets/test.js');
            await expect(second).toHaveAttribute('src', 'assets/test2.js');
            await expect(first).toHaveAttribute('type', 'text/javascript');
            await expect(second).toHaveAttribute('type', 'text/javascript');
            expect(await first.getAttribute('async')).toBeNull();
            expect(await second.getAttribute('async')).toBeNull();
        });

        test('loads scripts with attributes', async ({ page }) => {
            await page.evaluate((_) => {
                $.loadScripts([
                    {
                        src: 'assets/test.js',
                        integrity: 'sha384-1AK0oxsmb9+cemh1YwLG4rPfSc3jb81aGOY8CBrD6WNTumSzeeAs3p5iYyXJemZu',
                        crossorigin: 'anonymous',
                    },
                    {
                        src: 'assets/test2.js',
                        integrity: 'sha384-AhCcweXLV7j7q8PDvpl7r+bbPJICrsLyt6X2uQMwKva75GGIX3GZdxYhTVwgIcWT',
                        crossorigin: 'anonymous',
                    },
                ]);
            });

            const scripts = page.locator('head script');
            const first = scripts.nth(0);
            const second = scripts.nth(1);

            await expect(scripts).toHaveCount(2);
            await expect(first).toHaveAttribute('src', 'assets/test.js');
            await expect(second).toHaveAttribute('src', 'assets/test2.js');
            await expect(first).toHaveAttribute('integrity', 'sha384-1AK0oxsmb9+cemh1YwLG4rPfSc3jb81aGOY8CBrD6WNTumSzeeAs3p5iYyXJemZu');
            await expect(second).toHaveAttribute('integrity', 'sha384-AhCcweXLV7j7q8PDvpl7r+bbPJICrsLyt6X2uQMwKva75GGIX3GZdxYhTVwgIcWT');
            await expect(first).toHaveAttribute('crossorigin', 'anonymous');
            await expect(second).toHaveAttribute('crossorigin', 'anonymous');
        });
    });

    test.describe('cache behavior', () => {
        for (const [name, urls, expectedFirst, expectedSecond] of [
            [
                'without a query string',
                ['assets/test.js', 'assets/test2.js'],
                /^http:\/\/localhost:3001\/assets\/test\.js\?_=\d+$/,
                /^http:\/\/localhost:3001\/assets\/test2\.js\?_=\d+$/,
            ],
            [
                'with an existing query string',
                ['assets/test.js?test=1', 'assets/test2.js?test=2'],
                /^http:\/\/localhost:3001\/assets\/test\.js\?test=1&_=\d+$/,
                /^http:\/\/localhost:3001\/assets\/test2\.js\?test=2&_=\d+$/,
            ],
        ]) {
            test(`loads scripts without cache ${name}`, async ({ page }) => {
                await page.evaluate((urls) => {
                    $.loadScripts(urls, { cache: false });
                }, urls);

                const scripts = page.locator('head script');
                const firstSrc = await scripts.nth(0).getAttribute('src');
                const secondSrc = await scripts.nth(1).getAttribute('src');

                await expect(scripts).toHaveCount(2);
                expect(firstSrc).toMatch(expectedFirst);
                expect(secondSrc).toMatch(expectedSecond);
            });
        }
    });

    test.describe('completion', () => {
        test('resolves when the scripts are loaded', async ({ page }) => {
            const data = await page.evaluate(async (_) => {
                await $.loadScripts([
                    'assets/test.js',
                    'assets/test2.js',
                ]);
                return window.data;
            });

            expect(data).toBe('Test 2');
        });

        test('throws on error', async ({ page }) => {
            const didThrow = await page.evaluate(async (_) => {
                try {
                    await $.loadScripts([
                        'assets/error.js',
                        'assets/error2.js',
                    ]);
                    return false;
                } catch {
                    return true;
                }
            });

            expect(didThrow).toBe(true);
        });
    });
});
