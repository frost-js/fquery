import { expect, test } from '#test';

test.describe('#loadStyles', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, '<div id="test"></div>');
    });

    test.describe('attributes', () => {
        test('loads stylesheets', async ({ page }) => {
            await page.evaluate(() => {
                $.loadStyles([
                    'assets/test.css',
                    'assets/test2.css',
                ]);
            });

            const links = page.locator('head link');
            const first = links.nth(0);
            const second = links.nth(1);

            await expect(links).toHaveCount(2);
            await expect(first).toHaveAttribute('href', 'assets/test.css');
            await expect(second).toHaveAttribute('href', 'assets/test2.css');
            await expect(first).toHaveAttribute('rel', 'stylesheet');
            await expect(second).toHaveAttribute('rel', 'stylesheet');
        });

        test('loads stylesheets with attributes', async ({ page }) => {
            await page.evaluate(() => {
                $.loadStyles([
                    {
                        href: 'assets/test.css',
                        integrity: 'sha384-92bXn1Q36iY7yWatlPt66wCfjkIltnOTBPgiq2Vf8xM816mhHZfQ1w4JliBw10Fw',
                        crossorigin: 'anonymous',
                    },
                    {
                        href: 'assets/test2.css',
                        integrity: 'sha384-Ak4PzI/+z3i5IL+dTuDlBFZNoErlYYbiKQbx9SSmE9aHzimL26sAU+tEh5bUyzST',
                        crossorigin: 'anonymous',
                    },
                ]);
            });

            const links = page.locator('head link');
            const first = links.nth(0);
            const second = links.nth(1);

            await expect(links).toHaveCount(2);
            await expect(first).toHaveAttribute('href', 'assets/test.css');
            await expect(second).toHaveAttribute('href', 'assets/test2.css');
            await expect(first).toHaveAttribute('integrity', 'sha384-92bXn1Q36iY7yWatlPt66wCfjkIltnOTBPgiq2Vf8xM816mhHZfQ1w4JliBw10Fw');
            await expect(second).toHaveAttribute('integrity', 'sha384-Ak4PzI/+z3i5IL+dTuDlBFZNoErlYYbiKQbx9SSmE9aHzimL26sAU+tEh5bUyzST');
            await expect(first).toHaveAttribute('crossorigin', 'anonymous');
            await expect(second).toHaveAttribute('crossorigin', 'anonymous');
        });
    });

    test.describe('cache behavior', () => {
        for (const [name, urls, expectedFirst, expectedSecond] of [
            [
                'without a query string',
                ['assets/test.css', 'assets/test2.css'],
                /^http:\/\/localhost:3001\/assets\/test\.css\?_=\d+$/,
                /^http:\/\/localhost:3001\/assets\/test2\.css\?_=\d+$/,
            ],
            [
                'with an existing query string',
                ['assets/test.css?test=1', 'assets/test2.css?test=2'],
                /^http:\/\/localhost:3001\/assets\/test\.css\?test=1&_=\d+$/,
                /^http:\/\/localhost:3001\/assets\/test2\.css\?test=2&_=\d+$/,
            ],
        ]) {
            test(`loads stylesheets without cache ${name}`, async ({ page }) => {
                await page.evaluate((urls) => {
                    $.loadStyles(urls, { cache: false });
                }, urls);

                const links = page.locator('head link');
                const firstHref = await links.nth(0).getAttribute('href');
                const secondHref = await links.nth(1).getAttribute('href');

                await expect(links).toHaveCount(2);
                expect(firstHref).toMatch(expectedFirst);
                expect(secondHref).toMatch(expectedSecond);
            });
        }
    });

    test.describe('completion', () => {
        test('resolves when stylesheets are loaded', async ({ page }) => {
            await page.evaluate(async () => {
                await $.loadStyles([
                    'assets/test.css',
                    'assets/test2.css',
                ]);
            });

            await expect(page.locator('#test')).toHaveCSS('width', '100px');
            await expect(page.locator('#test')).toHaveCSS('height', '100px');
        });

        test('throws on error', async ({ page }) => {
            const didThrow = await page.evaluate(async () => {
                try {
                    await $.loadStyles([
                        'assets/error.css',
                        'assets/error2.css',
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
