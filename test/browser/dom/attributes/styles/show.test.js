import { setup, showTests } from '#cases/attributes/styles/show.js';
import { expect, test } from '#test';

test.describe('#show', () => {
    test.beforeEach(setup);

    showTests((args) => {
        $.show(...args);
    });

    test.describe('display restoration', () => {
        test('preserves a visible inline display value', async ({ page }) => {
            await page.evaluate((_) => {
                document.getElementById('test1').style.display = 'flex';
                $.show('#test1');
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
        });

        test('restores the inline display after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                document.getElementById('test1').style.display = 'flex';
                $.hide('#test1');
                $.show('#test1');
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
        });

        test('restores the inline display priority after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                document.getElementById('test1').style.setProperty('display', 'grid', 'important');
                $.hide('#test1');
                $.show('#test1');
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid !important;');
        });

        test('restores the original display after repeated hides', async ({ page }) => {
            await page.evaluate((_) => {
                document.getElementById('test1').style.display = 'flex';
                $.hide('#test1');
                $.hide('#test1');
                $.show('#test1');
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
        });
    });

    test.describe('display locks', () => {
        test('releases the display lock after showing', async ({ page }) => {
            await page.evaluate((_) => {
                $.hide('#test1');
                $.show('#test1');
                $.setStyleLock('#test1', 'display', 'grid');
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid;');
        });

        test('preserves display locks owned by other callers', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.setStyleLock('#test1', 'display', 'none');
                $.show('#test1');
                try {
                    $.setStyleLock('#test1', 'display', 'grid');
                } catch (error) {
                    return error.message;
                }
            })).toBe('CSS property "display" is already locked.');
        });
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.show(document.getElementById('test1'));
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', '');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.show(document.querySelectorAll('div'));
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', '');
            await expect(page.locator('#test2')).toHaveAttribute('style', '');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.show(document.body.children);
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', '');
            await expect(page.locator('#test2')).toHaveAttribute('style', '');
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.show([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ]);
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', '');
            await expect(page.locator('#test2')).toHaveAttribute('style', '');
        });
    });
});
