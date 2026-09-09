import { setStyleLockTests, setup } from '#cases/attributes/styles/set-style-lock.js';
import { expect, test } from '#test';

test.describe('#setStyleLock', () => {
    test.beforeEach(setup);

    setStyleLockTests((args) => {
        $.setStyleLock(...args);
    });

    test('preserves custom property name casing', async ({ page }) => {
        await page.evaluate((_) => {
            $.setStyleLock('#test1', '--brandColor', 'red');
            $.setStyleLock('#test1', '--brandcolor', 'blue');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', '--brandColor: red; --brandcolor: blue;');
    });

    test('returns a release function', async ({ page }) => {
        expect(await page.evaluate((_) => {
            return typeof $.setStyleLock('#test1', 'display', 'none');
        })).toBe('function');
    });

    test('restores the original value for each node', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.display = 'flex';
            document.getElementById('test2').style.display = 'grid';
            const release = $.setStyleLock('div', 'display', 'none');
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: grid;');
    });

    test('releases without restoring the current declaration', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.display = 'flex';
            const release = $.setStyleLock('#test1', 'display', 'none');
            $.setStyle('#test1', 'display', 'grid', { important: true });
            release({ restore: false });
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid !important;');
    });

    test('allows a new lock after releasing without restoring', async ({ page }) => {
        await page.evaluate((_) => {
            const release = $.setStyleLock('#test1', 'display', 'grid');
            release({ restore: false });
            const nextRelease = $.setStyleLock('#test1', 'display', 'none');
            nextRelease();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid;');
    });

    test('does not restore a discarded declaration when released again', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.display = 'flex';
            const release = $.setStyleLock('#test1', 'display', 'grid');
            release({ restore: false });
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid;');
    });

    test('restores a logical property when declaration order is preserved', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.cssText = 'width: 100px; inline-size: 200px; color: red;';
            const release = $.setStyleLock('#test1', 'inline-size', '300px');
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100px; inline-size: 200px; color: red;');
    });

    test('removes a declaration that was originally absent', async ({ page }) => {
        await page.evaluate((_) => {
            const release = $.setStyleLock('div', 'display', 'none');
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', '');
        await expect(page.locator('#test2')).toHaveAttribute('style', '');
    });

    test('restores the original important priority', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.setProperty('display', 'flex', 'important');
            const release = $.setStyleLock('#test1', 'display', 'none');
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex !important;');
    });

    test('restores custom property values', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.setProperty('--brandColor', 'red');
            const release = $.setStyleLock('#test1', '--brandColor', 'blue');
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', '--brandColor: red;');
    });

    test('restores an empty custom property declaration', async ({ page }) => {
        await page.evaluate((_) => {
            const node = document.getElementById('test1');
            node.style.cssText = '--empty:;';
            const release = $.setStyleLock(node, '--empty', 'temporary');
            release();
        });

        expect(await page.evaluate((_) =>
            document.getElementById('test1').style.getPropertyValue('--empty'))).toBe('');
        expect(await page.evaluate((_) =>
            [...document.getElementById('test1').style].includes('--empty'))).toBe(true);
    });

    test('restores an empty custom property with important', async ({ page }) => {
        await page.evaluate((_) => {
            const node = document.getElementById('test1');
            node.style.cssText = '--empty:!important;';
            const release = $.setStyleLock(node, '--empty', 'temporary');
            release();
        });

        expect(await page.evaluate((_) =>
            document.getElementById('test1').style.getPropertyValue('--empty'))).toBe('');
        expect(await page.evaluate((_) =>
            document.getElementById('test1').style.getPropertyPriority('--empty'))).toBe('important');
    });

    test('restores a temporarily removed declaration', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.display = 'flex';
            const release = $.setStyleLock('#test1', 'display', '');
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
    });

    test('preserves unrelated style changes when released', async ({ page }) => {
        await page.evaluate((_) => {
            const release = $.setStyleLock('#test1', 'display', 'none');
            $.setStyle('#test1', 'opacity', 0.5);
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'opacity: 0.5;');
    });

    test('restores the original value after an ordinary style write', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.display = 'flex';
            const release = $.setStyleLock('#test1', 'display', 'none');
            $.setStyle('#test1', 'display', 'grid');
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
    });

    test('allows independent property locks', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.display = 'flex';
            const release = $.setStyleLock('#test1', 'display', 'none');
            $.setStyleLock('#test1', 'opacity', 0.5);
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex; opacity: 0.5;');
    });

    test('does not release a newer lock when called again', async ({ page }) => {
        await page.evaluate((_) => {
            const release = $.setStyleLock('#test1', 'display', 'none');
            release();
            $.setStyleLock('#test1', 'display', 'grid');
            release();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: grid;');
    });

    test('rejects a property that is already locked', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setStyleLock('#test1', 'display', 'none');
            try {
                $.setStyleLock('#test1', 'display', 'block');
            } catch (error) {
                return error.message;
            }
        })).toBe('CSS property "display" is already locked.');
    });

    test('matches locks using normalized property names', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setStyleLock('#test1', 'marginTop', 10);
            try {
                $.setStyleLock('#test1', 'margin-top', 20);
            } catch (error) {
                return error.message;
            }
        })).toBe('CSS property "margin-top" is already locked.');
    });

    test('does not change any nodes when a later node is locked', async ({ page }) => {
        expect(await page.evaluate((_) => {
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
        expect(await page.evaluate((_) => {
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

    test('rejects shorthand properties', async ({ page }) => {
        expect(await page.evaluate((_) => {
            try {
                $.setStyleLock('#test1', 'margin', '10px');
            } catch (error) {
                return error.message;
            }
        })).toBe('Cannot lock CSS property "margin". Use a supported longhand or custom property.');
    });

    test('rejects the all shorthand', async ({ page }) => {
        expect(await page.evaluate((_) => {
            try {
                $.setStyleLock('#test1', 'all', 'initial');
            } catch (error) {
                return error.message;
            }
        })).toBe('Cannot lock CSS property "all". Use a supported longhand or custom property.');
    });

    test('rejects property aliases', async ({ page }) => {
        expect(await page.evaluate((_) => {
            try {
                $.setStyleLock('#test1', 'word-wrap', 'break-word');
            } catch (error) {
                return error.message;
            }
        })).toBe('Cannot lock CSS property "word-wrap". Use a supported longhand or custom property.');
    });

    test('rejects unsupported properties', async ({ page }) => {
        expect(await page.evaluate((_) => {
            try {
                $.setStyleLock('#test1', 'not-a-property', 'initial');
            } catch (error) {
                return error.message;
            }
        })).toBe('Cannot lock CSS property "not-a-property". Use a supported longhand or custom property.');
    });

    test('rejects invalid property values', async ({ page }) => {
        expect(await page.evaluate((_) => {
            try {
                $.setStyleLock('#test1', 'display', 'invalid');
            } catch (error) {
                return error.message;
            }
        })).toBe('Invalid value for CSS property "display".');
    });

    test('rejects longhands supplied by a variable-based shorthand', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.getElementById('test1').style.cssText = '--spacing: 20px; padding: var(--spacing);';
            try {
                $.setStyleLock('#test1', 'padding-left', '5px');
            } catch (error) {
                return error.message;
            }
        })).toBe('Cannot lock CSS property "padding-left" because its original value cannot be restored.');

        await expect(page.locator('#test1')).toHaveAttribute('style', '--spacing: 20px; padding: var(--spacing);');
    });

    test('does not change any nodes when a later original value cannot be restored', async ({ page }) => {
        expect(await page.evaluate((_) => {
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
        expect(await page.evaluate((_) => {
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

    test('rejects a physical property that would move past a logical property', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.getElementById('test1').style.cssText = 'width: 100px; inline-size: 200px;';
            try {
                $.setStyleLock('#test1', 'width', '300px');
            } catch (error) {
                return error.message;
            }
        })).toBe('Cannot lock CSS property "width" because its original value cannot be restored.');

        await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100px; inline-size: 200px;');
    });

    test('rejects a logical property that would move past a physical property', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.getElementById('test1').style.cssText = 'inline-size: 200px; width: 100px;';
            try {
                $.setStyleLock('#test1', 'inline-size', '300px');
            } catch (error) {
                return error.message;
            }
        })).toBe('Cannot lock CSS property "inline-size" because its original value cannot be restored.');

        await expect(page.locator('#test1')).toHaveAttribute('style', 'inline-size: 200px; width: 100px;');
    });

    test('does not change any nodes when a later declaration would be reordered', async ({ page }) => {
        expect(await page.evaluate((_) => {
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
        expect(await page.evaluate((_) => {
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

    test('works with forms whose style property is shadowed', async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML = '<form id="form" style="display: flex;"><input name="style"></form>';
            const release = $.setStyleLock('form', 'display', 'none');
            release();
        });

        await expect(page.locator('#form')).toHaveAttribute('style', 'display: flex;');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setStyleLock(document.getElementById('test1'), 'display', 'none');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        expect(await page.locator('#test2').getAttribute('style')).toBeNull();
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setStyleLock(document.querySelectorAll('div'), 'display', 'none');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setStyleLock(document.body.children, 'display', 'none');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setStyleLock([document.getElementById('test1'), document.getElementById('test2')], 'display', 'none');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
    });

    test('works with an empty selection', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const release = $.setStyleLock('.missing', 'display', 'none');
            release();
            return typeof release;
        })).toBe('function');
    });
});
