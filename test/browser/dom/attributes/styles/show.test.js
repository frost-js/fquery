import { expect, test } from '#test';

test.describe('#show', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML = '<div id="test1" style="display: none;"></div><div id="test2" style="display: none;"></div>';
        });
    });

    test('shows all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.show('div');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', '');
        await expect(page.locator('#test2')).toHaveAttribute('style', '');
    });

    test('shows block elements hidden by a stylesheet', async ({ page }) => {
        await page.addStyleTag({ content: '.hidden { display: none; }' });
        await page.evaluate((_) => {
            document.getElementById('test1').classList.add('hidden');
            $.show('#test1');
        });

        await expect(page.locator('#test1')).toHaveCSS('display', 'block');
    });

    test('shows inline elements hidden by a stylesheet', async ({ page }) => {
        await page.addStyleTag({ content: '.hidden { display: none; }' });
        await page.evaluate((_) => {
            document.body.innerHTML = '<span id="test1" class="hidden">Test</span>';
            $.show('#test1');
        });

        await expect(page.locator('#test1')).toHaveCSS('display', 'inline');
    });

    test('shows table rows hidden by a stylesheet', async ({ page }) => {
        await page.addStyleTag({ content: '.hidden { display: none; }' });
        await page.evaluate((_) => {
            document.body.innerHTML = '<table><tbody><tr id="test1" class="hidden"><td>Test</td></tr></tbody></table>';
            $.show('#test1');
        });

        await expect(page.locator('#test1')).toHaveCSS('display', 'table-row');
    });

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
