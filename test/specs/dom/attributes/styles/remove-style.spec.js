import { expect, test } from '@playwright/test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1" style="background-color: blue; color: white;"></div><div id="test2" style="background-color: blue; color: white;"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#removeStyle', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('removes a style from all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeStyle('div', 'color');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'background-color: blue;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'background-color: blue;');
    });

    test('removes a custom property', async ({ page }) => {
        await page.evaluate((_) => {
            for (const node of document.querySelectorAll('div')) {
                node.style.setProperty('--theme-color', 'red');
            }

            $.removeStyle('div', '--theme-color');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'background-color: blue; color: white;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'background-color: blue; color: white;');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeStyle(document.getElementById('test1'), 'color');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'background-color: blue;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'background-color: blue; color: white;');
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeStyle(document.querySelectorAll('div'), 'color');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'background-color: blue;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'background-color: blue;');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeStyle(document.body.children, 'color');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'background-color: blue;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'background-color: blue;');
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeStyle([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'color');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'background-color: blue;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'background-color: blue;');
    });
});
