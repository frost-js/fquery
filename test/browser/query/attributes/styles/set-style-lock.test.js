import { setStyleLockTests, setup } from '#cases/attributes/styles/set-style-lock.js';
import { expect, test } from '#test';

test.describe('QuerySet #setStyleLock', () => {
    test.beforeEach(setup);

    setStyleLockTests(([nodes, ...args]) => {
        $(nodes).setStyleLock(...args);
    });

    test('returns a release function', async ({ page }) => {
        expect(await page.evaluate((_) => {
            return typeof $('#test1').setStyleLock('display', 'none');
        })).toBe('function');
    });

    test('restores the original value for each node', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.display = 'flex';
            document.getElementById('test2').style.display = 'grid';
            const release = $('div').setStyleLock('display', 'none');
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: grid;');
    });

    test('releases without restoring the current declaration', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.display = 'flex';
            const release = $('#test1').setStyleLock('display', 'none');
            $('#test1').setStyle('display', 'grid', { important: true });
            release({ restore: false });
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid !important;');
    });

    test('restores a logical property when declaration order is preserved', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.cssText = 'width: 100px; inline-size: 200px; color: red;';
            const release = $('#test1').setStyleLock('inline-size', '300px');
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100px; inline-size: 200px; color: red;');
    });

    test('removes a declaration that was originally absent', async ({ page }) => {
        await page.evaluate((_) => {
            const release = $('div').setStyleLock('display', 'none');
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', '');
        await expect(page.locator('#test2')).toHaveAttribute('style', '');
    });

    test('restores the original important priority', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.setProperty('display', 'flex', 'important');
            const release = $('#test1').setStyleLock('display', 'none');
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex !important;');
    });

    test('restores custom property values', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.setProperty('--brandColor', 'red');
            const release = $('#test1').setStyleLock('--brandColor', 'blue');
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', '--brandColor: red;');
    });

    test('allows independent property locks', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.display = 'flex';
            const release = $('#test1').setStyleLock('display', 'none');
            $('#test1').setStyleLock('opacity', 0.5);
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex; opacity: 0.5;');
    });

    test('does not release a newer lock when called again', async ({ page }) => {
        await page.evaluate((_) => {
            const release = $('#test1').setStyleLock('display', 'none');
            release();
            $('#test1').setStyleLock('display', 'grid');
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid;');
    });

    test('rejects a property that is already locked', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('#test1').setStyleLock('display', 'none');
            try {
                $('#test1').setStyleLock('display', 'block');
            } catch (error) {
                return error.message;
            }
        })).toBe('CSS property "display" is already locked.');
    });

    test('rejects shorthand properties', async ({ page }) => {
        expect(await page.evaluate((_) => {
            try {
                $('#test1').setStyleLock('margin', '10px');
            } catch (error) {
                return error.message;
            }
        })).toBe('Cannot lock CSS property "margin". Use a supported longhand or custom property.');
    });

    test('rejects invalid property values', async ({ page }) => {
        expect(await page.evaluate((_) => {
            try {
                $('#test1').setStyleLock('display', 'invalid');
            } catch (error) {
                return error.message;
            }
        })).toBe('Invalid value for CSS property "display".');
    });

    test('rejects longhands supplied by a variable-based shorthand', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.getElementById('test1').style.cssText = '--spacing: 20px; padding: var(--spacing);';
            try {
                $('#test1').setStyleLock('padding-left', '5px');
            } catch (error) {
                return error.message;
            }
        })).toBe('Cannot lock CSS property "padding-left" because its original value cannot be restored.');

        await expect(page.locator('#test1')).toHaveAttribute('style', '--spacing: 20px; padding: var(--spacing);');
    });

    test('rejects a physical property that would move past a logical property', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.getElementById('test1').style.cssText = 'width: 100px; inline-size: 200px;';
            try {
                $('#test1').setStyleLock('width', '300px');
            } catch (error) {
                return error.message;
            }
        })).toBe('Cannot lock CSS property "width" because its original value cannot be restored.');

        await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100px; inline-size: 200px;');
    });

    test('releases duplicate nodes only once', async ({ page }) => {
        await page.evaluate((_) => {
            const node = document.getElementById('test1');
            node.style.display = 'flex';
            const query = $('div').map((_) => node);
            const release = query.setStyleLock('display', 'none');
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
    });

    test('works with an empty selection', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const release = $('.missing').setStyleLock('display', 'none');
            release();
            return typeof release;
        })).toBe('function');
    });
});
