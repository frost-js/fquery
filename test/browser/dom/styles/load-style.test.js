import { expect, test } from '#test';

test.describe('#loadStyle', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, '<div id="test"></div>');
    });

    test.describe('attributes', () => {
        test('loads a stylesheet', async ({ page }) => {
            await page.evaluate(() => {
                $.loadStyle('assets/test.css');
            });

            const link = page.locator('head link');

            await expect(link).toHaveCount(1);
            await expect(link).toHaveAttribute('href', 'assets/test.css');
            await expect(link).toHaveAttribute('rel', 'stylesheet');
        });

        test('loads a stylesheet with attributes', async ({ page }) => {
            await page.evaluate(() => {
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
    });

    test.describe('cache behavior', () => {
        for (const [name, url, expected] of [
            [
                'without a query string',
                'assets/test.css',
                /^http:\/\/localhost:3001\/assets\/test\.css\?_=\d+$/,
            ],
            [
                'with an existing query string',
                'assets/test.css?test=1',
                /^http:\/\/localhost:3001\/assets\/test\.css\?test=1&_=\d+$/,
            ],
        ]) {
            test(`loads a stylesheet without cache ${name}`, async ({ page }) => {
                await page.evaluate((url) => {
                    $.loadStyle(url, null, { cache: false });
                }, url);

                const link = page.locator('head link');
                const href = await link.getAttribute('href');

                await expect(link).toHaveCount(1);
                expect(href).toMatch(expected);
            });
        }
    });

    test.describe('contexts', () => {
        test('loads a stylesheet without cache using the document base URL', async ({ page }) => {
            await page.evaluate(() => {
                document.head.innerHTML = '<base href="/assets/">';
                $.loadStyle('test.css?test=1', null, { cache: false });
            });

            const link = page.locator('head link');
            const href = await link.getAttribute('href');

            await expect(link).toHaveCount(1);
            expect(href).toMatch(/^http:\/\/localhost:3001\/assets\/test\.css\?test=1&_=\d+$/);
        });

        test('loads a stylesheet without cache in a context with a different base URL', async ({ page }) => {
            await page.evaluate(() => {
                const iframe = document.createElement('iframe');
                document.body.appendChild(iframe);
                const context = iframe.contentDocument;
                context.head.innerHTML = '<base href="http://localhost:3001/assets/">';
                $.loadStyle('test.css?test=1', null, { cache: false, context });
            });

            const link = page.frameLocator('iframe').locator('head link');
            const href = await link.getAttribute('href');

            await expect(link).toHaveCount(1);
            expect(href).toMatch(/^http:\/\/localhost:3001\/assets\/test\.css\?test=1&_=\d+$/);
        });
    });

    test.describe('completion', () => {
        test('resolves when the stylesheet is loaded', async ({ page }) => {
            await page.evaluate(async () => {
                await $.loadStyle('assets/test.css');
            });

            await expect(page.locator('#test')).toHaveCSS('width', '100px');
        });

        test('throws on error', async ({ page }) => {
            const didThrow = await page.evaluate(async () => {
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
});
