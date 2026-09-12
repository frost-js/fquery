import { setup, showTests } from '#cases/attributes/styles/show.js';
import { expect, test } from '#test';

test.describe('QuerySet #show', () => {
    test.beforeEach(setup);

    showTests(([nodes]) => {
        $(nodes).show();
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.show();
        })).toBe(true);
    });

    test.describe('display restoration', () => {
        test('preserves a visible inline display value', async ({ page }) => {
            await page.evaluate((_) => {
                document.getElementById('test1').style.display = 'flex';
                $('#test1').show();
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
        });

        test('restores the inline display after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                document.getElementById('test1').style.display = 'flex';
                $('#test1').hide();
                $('#test1').show();
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
        });

        test('restores the inline display priority after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                document.getElementById('test1').style.setProperty('display', 'grid', 'important');
                $('#test1').hide();
                $('#test1').show();
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid !important;');
        });

        test('restores the original display after repeated hides', async ({ page }) => {
            await page.evaluate((_) => {
                document.getElementById('test1').style.display = 'flex';
                $('#test1').hide();
                $('#test1').hide();
                $('#test1').show();
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
        });
    });

    test.describe('display locks', () => {
        test('releases the display lock after showing', async ({ page }) => {
            await page.evaluate((_) => {
                $('#test1').hide();
                $('#test1').show();
                $('#test1').setStyleLock('display', 'grid');
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid;');
        });

        test('preserves display locks owned by other callers', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#test1').setStyleLock('display', 'none');
                $('#test1').show();
                try {
                    $('#test1').setStyleLock('display', 'grid');
                } catch (error) {
                    return error.message;
                }
            })).toBe('CSS property "display" is already locked.');
        });
    });
});
