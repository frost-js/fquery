import { expect, test } from '#test';

test.describe('QuerySet #removeStyle', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML = '<div id="test1" style="background-color: blue; color: white;"></div><div id="test2" style="background-color: blue; color: white;"></div>';
        });
    });

    test('sets a style value for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').removeStyle('color');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'background-color: blue;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'background-color: blue;');
    });

    test('removes a custom property', async ({ page }) => {
        await page.evaluate((_) => {
            for (const node of document.querySelectorAll('div')) {
                node.style.setProperty('--brandColor', 'red');
            }

            $('div').removeStyle('--brandColor');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'background-color: blue; color: white;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'background-color: blue; color: white;');
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.removeStyle('color');
        })).toBe(true);
    });
});
