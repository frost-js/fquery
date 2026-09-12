/** @import { Page } from '@playwright/test'; */
/** @import { ReleaseStyleLock } from '../../../../src/attributes/style-locks.js'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML = '<div id="test1"></div><div id="test2"></div>';
    });
};

/**
 * Registers shared setStyleLock behavior tests.
 * @param {((args: [string, string, string|number, { important?: boolean }?]) => ReleaseStyleLock)} setStyleLock The browser callback for setStyleLock.
 */
export function setStyleLockTests(setStyleLock) {
    test.describe('setting styles', () => {
        test('sets a style value for all nodes', async ({ page }) => {
            await page.evaluate(setStyleLock, ['div', 'display', 'none']);

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
        });

        test('sets a style value with important', async ({ page }) => {
            await page.evaluate(setStyleLock, ['div', 'display', 'none', { important: true }]);

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none !important;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none !important;');
        });

        test('normalizes camelCase property names', async ({ page }) => {
            await page.evaluate(setStyleLock, ['#test1', 'marginTop', '10px']);

            await expect(page.locator('#test1')).toHaveAttribute('style', 'margin-top: 10px;');
        });

        test('converts number values to pixels', async ({ page }) => {
            await page.evaluate(setStyleLock, ['#test1', 'width', 100]);

            await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100px;');
        });
    });

    test.describe('restoration', () => {
        test('restores the original value for each node', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('test1').style.display = 'flex';
                document.getElementById('test2').style.display = 'grid';
            });

            const release = await page.evaluateHandle(setStyleLock, ['div', 'display', 'none']);

            await release.evaluate((release) => release());

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'display: grid;');
        });

        test('restores a logical property when declaration order is preserved', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('test1').style.cssText = 'width: 100px; inline-size: 200px; color: red;';
            });

            const release = await page.evaluateHandle(setStyleLock, ['#test1', 'inline-size', '300px']);

            await release.evaluate((release) => release());

            await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100px; inline-size: 200px; color: red;');
        });

        test('removes a declaration that was originally absent', async ({ page }) => {
            const release = await page.evaluateHandle(setStyleLock, ['div', 'display', 'none']);

            await release.evaluate((release) => release());

            await expect(page.locator('#test1')).toHaveAttribute('style', '');
            await expect(page.locator('#test2')).toHaveAttribute('style', '');
        });

        test('restores the original important priority', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('test1').style.setProperty('display', 'flex', 'important');
            });

            const release = await page.evaluateHandle(setStyleLock, ['#test1', 'display', 'none']);

            await release.evaluate((release) => release());

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex !important;');
        });

        test('restores custom property values', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('test1').style.setProperty('--brandColor', 'red');
            });

            const release = await page.evaluateHandle(setStyleLock, ['#test1', '--brandColor', 'blue']);

            await release.evaluate((release) => release());

            await expect(page.locator('#test1')).toHaveAttribute('style', '--brandColor: red;');
        });
    });

    test.describe('release lifecycle', () => {
        test('returns a release function', async ({ page }) => {
            const release = await page.evaluateHandle(setStyleLock, ['#test1', 'display', 'none']);

            expect(await release.evaluate((release) => typeof release)).toBe('function');
        });

        test('releases without restoring the current declaration', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('test1').style.display = 'flex';
            });

            const release = await page.evaluateHandle(setStyleLock, ['#test1', 'display', 'none']);

            await page.evaluate(() => {
                $.setStyle('#test1', 'display', 'grid', { important: true });
            });

            await release.evaluate((release) => release({ restore: false }));

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid !important;');
        });

        test('allows independent property locks', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('test1').style.display = 'flex';
            });

            const release = await page.evaluateHandle(setStyleLock, ['#test1', 'display', 'none']);

            await page.evaluate(setStyleLock, ['#test1', 'opacity', 0.5]);

            await release.evaluate((release) => release());

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex; opacity: 0.5;');
        });

        test('does not release a newer lock when called again', async ({ page }) => {
            const release = await page.evaluateHandle(setStyleLock, ['#test1', 'display', 'none']);

            await release.evaluate((release) => release());

            await page.evaluate(setStyleLock, ['#test1', 'display', 'grid']);

            await release.evaluate((release) => release());

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid;');
        });
    });

    test.describe('validation', () => {
        test('rejects a property that is already locked', async ({ page }) => {
            await page.evaluate(setStyleLock, ['#test1', 'display', 'none']);

            await expect(page.evaluate(setStyleLock, ['#test1', 'display', 'block']))
                    .rejects.toThrow('CSS property "display" is already locked.');
        });

        test('rejects shorthand properties', async ({ page }) => {
            await expect(page.evaluate(setStyleLock, ['#test1', 'margin', '10px']))
                    .rejects.toThrow('Cannot lock CSS property "margin". Use a supported longhand or custom property.');
        });

        test('rejects invalid property values', async ({ page }) => {
            await expect(page.evaluate(setStyleLock, ['#test1', 'display', 'invalid']))
                    .rejects.toThrow('Invalid value for CSS property "display".');
        });

        test('rejects longhands supplied by a variable-based shorthand', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('test1').style.cssText = '--spacing: 20px; padding: var(--spacing);';
            });

            await expect(page.evaluate(setStyleLock, ['#test1', 'padding-left', '5px']))
                    .rejects.toThrow('Cannot lock CSS property "padding-left" because its original value cannot be restored.');

            await expect(page.locator('#test1')).toHaveAttribute('style', '--spacing: 20px; padding: var(--spacing);');
        });

        test('rejects a physical property that would move past a logical property', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('test1').style.cssText = 'width: 100px; inline-size: 200px;';
            });

            await expect(page.evaluate(setStyleLock, ['#test1', 'width', '300px']))
                    .rejects.toThrow('Cannot lock CSS property "width" because its original value cannot be restored.');

            await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100px; inline-size: 200px;');
        });
    });
}
