import { hideTests, setup } from '#cases/attributes/styles/hide.js';
import { expect, test } from '#test';

test.describe('QuerySet #hide', () => {
    test.beforeEach(setup);

    hideTests(([nodes, ...args]) => {
        $(nodes).hide(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.hide();
        })).toBe(true);
    });

    test.describe('display priority', () => {
        test('preserves the inline display priority', async ({ page }) => {
            await page.addStyleTag({ content: '#test1 { display: flex !important; }' });
            await page.evaluate((_) => {
                document.getElementById('test1').style.setProperty('display', 'grid', 'important');
                $('#test1').hide();
            });

            await expect(page.locator('#test1')).toHaveCSS('display', 'none');
        });
    });

    test.describe('repeated hides', () => {
        test('preserves the inline display priority after repeated hides', async ({ page }) => {
            await page.addStyleTag({ content: '#test1 { display: flex !important; }' });
            await page.evaluate((_) => {
                document.getElementById('test1').style.setProperty('display', 'grid', 'important');
                $('#test1').hide();
                $('#test1').hide();
            });

            await expect(page.locator('#test1')).toHaveCSS('display', 'none');
        });

        test('hides again after an ordinary style write', async ({ page }) => {
            await page.evaluate((_) => {
                $('#test1').hide();
                document.getElementById('test1').style.display = 'flex';
                $('#test1').hide();
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        });
    });

    test.describe('display locks', () => {
        test('does not hide earlier nodes when a later display is locked', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#test2').setStyleLock('display', 'grid');
                try {
                    $('div').hide();
                } catch (error) {
                    return error.message;
                }
            })).toBe('CSS property "display" is already locked.');

            expect(await page.locator('#test1').getAttribute('style')).toBeNull();
            await expect(page.locator('#test2')).toHaveAttribute('style', 'display: grid;');
        });
    });
});
