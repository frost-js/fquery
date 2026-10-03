import { setStyleLockTests, setup } from '#cases/attributes/styles/set-style-lock.js';
import { expect, test } from '#test';

test.describe('#setStyleLock', () => {
    test.beforeEach(setup);

    setStyleLockTests((args) => $.setStyleLock(...args));

    test.describe('setting styles', () => {
        test('preserves custom property name casing', async ({ page }) => {
            await page.evaluate(() => {
                $.setStyleLock('#test1', '--brandColor', 'red');
                $.setStyleLock('#test1', '--brandcolor', 'blue');
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', '--brandColor: red; --brandcolor: blue;');
        });
    });

    test.describe('restoration', () => {
        test('restores an empty custom property declaration', async ({ page }) => {
            await page.evaluate(() => {
                const node = document.getElementById('test1');
                node.style.cssText = '--empty:;';
                const release = $.setStyleLock(node, '--empty', 'temporary');
                release();
            });

            expect(await page.evaluate(() =>
                document.getElementById('test1').style.getPropertyValue('--empty'))).toBe('');
            expect(await page.evaluate(() =>
                [...document.getElementById('test1').style].includes('--empty'))).toBe(true);
        });

        test('restores an empty custom property with important', async ({ page }) => {
            await page.evaluate(() => {
                const node = document.getElementById('test1');
                node.style.cssText = '--empty:!important;';
                const release = $.setStyleLock(node, '--empty', 'temporary');
                release();
            });

            expect(await page.evaluate(() =>
                document.getElementById('test1').style.getPropertyValue('--empty'))).toBe('');
            expect(await page.evaluate(() =>
                document.getElementById('test1').style.getPropertyPriority('--empty'))).toBe('important');
        });

        test('restores a temporarily removed declaration', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('test1').style.display = 'flex';
                const release = $.setStyleLock('#test1', 'display', '');
                release();
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
        });

        test('preserves unrelated style changes when released', async ({ page }) => {
            await page.evaluate(() => {
                const release = $.setStyleLock('#test1', 'display', 'none');
                $.setStyle('#test1', 'opacity', 0.5);
                release();
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'opacity: 0.5;');
        });

        test('restores the original value after an ordinary style write', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('test1').style.display = 'flex';
                const release = $.setStyleLock('#test1', 'display', 'none');
                $.setStyle('#test1', 'display', 'grid');
                release();
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
        });
    });

    test.describe('release lifecycle', () => {
        test('allows a new lock after releasing without restoring', async ({ page }) => {
            await page.evaluate(() => {
                const release = $.setStyleLock('#test1', 'display', 'grid');
                release({ restore: false });
                const nextRelease = $.setStyleLock('#test1', 'display', 'none');
                nextRelease();
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid;');
        });

        test('does not restore a discarded declaration when released again', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('test1').style.display = 'flex';
                const release = $.setStyleLock('#test1', 'display', 'grid');
                release({ restore: false });
                release();
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid;');
        });
    });

    test.describe('validation', () => {
        test('matches locks using normalized property names', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.setStyleLock('#test1', 'marginTop', 10);
                try {
                    $.setStyleLock('#test1', 'margin-top', 20);
                } catch (error) {
                    return error.message;
                }
            })).toBe('CSS property "margin-top" is already locked.');
        });

        test('rejects the all shorthand', async ({ page }) => {
            expect(await page.evaluate(() => {
                try {
                    $.setStyleLock('#test1', 'all', 'initial');
                } catch (error) {
                    return error.message;
                }
            })).toBe('Cannot lock CSS property "all". Use a supported longhand or custom property.');
        });

        test('rejects property aliases', async ({ page }) => {
            expect(await page.evaluate(() => {
                try {
                    $.setStyleLock('#test1', 'word-wrap', 'break-word');
                } catch (error) {
                    return error.message;
                }
            })).toBe('Cannot lock CSS property "word-wrap". Use a supported longhand or custom property.');
        });

        test('rejects unsupported properties', async ({ page }) => {
            expect(await page.evaluate(() => {
                try {
                    $.setStyleLock('#test1', 'not-a-property', 'initial');
                } catch (error) {
                    return error.message;
                }
            })).toBe('Cannot lock CSS property "not-a-property". Use a supported longhand or custom property.');
        });

        test('rejects a logical property that would move past a physical property', async ({ page }) => {
            expect(await page.evaluate(() => {
                document.getElementById('test1').style.cssText = 'inline-size: 200px; width: 100px;';
                try {
                    $.setStyleLock('#test1', 'inline-size', '300px');
                } catch (error) {
                    return error.message;
                }
            })).toBe('Cannot lock CSS property "inline-size" because its original value cannot be restored.');

            await expect(page.locator('#test1')).toHaveAttribute('style', 'inline-size: 200px; width: 100px;');
        });
    });

    test.describe('failed locks', () => {
        test('does not change any nodes when a later node is locked', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.setStyleLock('#test2', 'display', 'none');
                try {
                    $.setStyleLock('div', 'display', 'block');
                } catch (error) {
                    return error.message;
                }
            })).toBe('CSS property "display" is already locked.');

            expect(await page.locator('#test1').getAttribute('style')).toBeNull();
            await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
        });

        test('does not leave earlier nodes locked after a conflict', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.setStyleLock('#test2', 'display', 'none');
                try {
                    $.setStyleLock('div', 'display', 'block');
                } catch {
                    const release = $.setStyleLock('#test1', 'display', 'grid');
                    release();
                    return true;
                }
            })).toBe(true);
        });

        test('does not change any nodes when a later original value cannot be restored', async ({ page }) => {
            expect(await page.evaluate(() => {
                document.getElementById('test1').style.paddingLeft = '10px';
                document.getElementById('test2').style.cssText = '--spacing: 20px; padding: var(--spacing);';
                try {
                    $.setStyleLock('div', 'padding-left', '5px');
                } catch (error) {
                    return error.message;
                }
            })).toBe('Cannot lock CSS property "padding-left" because its original value cannot be restored.');

            await expect(page.locator('#test1')).toHaveAttribute('style', 'padding-left: 10px;');
            await expect(page.locator('#test2')).toHaveAttribute('style', '--spacing: 20px; padding: var(--spacing);');
        });

        test('does not leave nodes locked when an original value cannot be restored', async ({ page }) => {
            expect(await page.evaluate(() => {
                document.getElementById('test2').style.cssText = '--spacing: 20px; padding: var(--spacing);';
                try {
                    $.setStyleLock('div', 'padding-left', '5px');
                } catch {
                    document.getElementById('test2').style.padding = '20px';
                    const release = $.setStyleLock('div', 'padding-left', '5px');
                    release();
                    return true;
                }
            })).toBe(true);
        });

        test('does not change any nodes when a later declaration would be reordered', async ({ page }) => {
            expect(await page.evaluate(() => {
                document.getElementById('test1').style.width = '50px';
                document.getElementById('test2').style.cssText = 'width: 100px; inline-size: 200px;';
                try {
                    $.setStyleLock('div', 'width', '300px');
                } catch (error) {
                    return error.message;
                }
            })).toBe('Cannot lock CSS property "width" because its original value cannot be restored.');

            await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 50px;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'width: 100px; inline-size: 200px;');
        });

        test('does not leave nodes locked when a declaration would be reordered', async ({ page }) => {
            expect(await page.evaluate(() => {
                document.getElementById('test2').style.cssText = 'width: 100px; inline-size: 200px;';
                try {
                    $.setStyleLock('div', 'width', '300px');
                } catch {
                    document.getElementById('test2').style.removeProperty('inline-size');
                    const release = $.setStyleLock('div', 'width', '300px');
                    release();
                    return true;
                }
            })).toBe(true);
        });
    });

    test.describe('node inputs', () => {
        test('works with forms whose style property is shadowed', async ({ page }) => {
            await page.evaluate(() => {
                document.body.innerHTML = '<form id="form" style="display: flex;"><input name="style"></form>';
                const release = $.setStyleLock('form', 'display', 'none');
                release();
            });

            await expect(page.locator('#form')).toHaveAttribute('style', 'display: flex;');
        });

        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setStyleLock(document.getElementById('test1'), 'display', 'none');
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
            expect(await page.locator('#test2').getAttribute('style')).toBeNull();
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setStyleLock(document.querySelectorAll('div'), 'display', 'none');
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setStyleLock(document.body.children, 'display', 'none');
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setStyleLock([document.getElementById('test1'), document.getElementById('test2')], 'display', 'none');
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
            await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
        });

        test('works with an empty selection', async ({ page }) => {
            expect(await page.evaluate(() => {
                const release = $.setStyleLock('.missing', 'display', 'none');
                release();
                return typeof release;
            })).toBe('function');
        });
    });
});
