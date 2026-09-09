import { expect, test } from '#test';

test.describe('#hide', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML = '<div id="test1"></div><div id="test2"></div>';
        });
    });

    test('hides all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.hide('div');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
    });

    test('preserves the inline display priority', async ({ page }) => {
        await page.addStyleTag({ content: '#test1 { display: flex !important; }' });
        await page.evaluate((_) => {
            document.getElementById('test1').style.setProperty('display', 'grid', 'important');
            $.hide('#test1');
        });

        await expect(page.locator('#test1')).toHaveCSS('display', 'none');
    });

    test('preserves the inline display priority after repeated hides', async ({ page }) => {
        await page.addStyleTag({ content: '#test1 { display: flex !important; }' });
        await page.evaluate((_) => {
            document.getElementById('test1').style.setProperty('display', 'grid', 'important');
            $.hide('#test1');
            $.hide('#test1');
        });

        await expect(page.locator('#test1')).toHaveCSS('display', 'none');
    });

    test('hides again after an ordinary style write', async ({ page }) => {
        await page.evaluate((_) => {
            $.hide('#test1');
            document.getElementById('test1').style.display = 'flex';
            $.hide('#test1');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
    });

    test('does not hide earlier nodes when a later display is locked', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setStyleLock('#test2', 'display', 'grid');
            try {
                $.hide('div');
            } catch (error) {
                return error.message;
            }
        })).toBe('CSS property "display" is already locked.');

        expect(await page.locator('#test1').getAttribute('style')).toBeNull();
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: grid;');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.hide(document.getElementById('test1'));
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        expect(await page.locator('#test2').getAttribute('style')).toBeNull();
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.hide(document.querySelectorAll('div'));
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.hide(document.body.children);
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.hide([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]);
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
    });
});
