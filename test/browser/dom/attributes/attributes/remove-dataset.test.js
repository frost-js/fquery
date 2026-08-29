import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1" data-text="Test"></div><div id="test2" data-text="Test"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#removeDataset', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('removes a dataset value for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeDataset('div', 'text');
        });

        expect(await page.locator('#test1').getAttribute('data-text')).toBeNull();
        expect(await page.locator('#test2').getAttribute('data-text')).toBeNull();
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeDataset(document.getElementById('test1'), 'text');
        });

        expect(await page.locator('#test1').getAttribute('data-text')).toBeNull();
        await expect(page.locator('#test2')).toHaveAttribute('data-text', 'Test');
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeDataset(document.querySelectorAll('div'), 'text');
        });

        expect(await page.locator('#test1').getAttribute('data-text')).toBeNull();
        expect(await page.locator('#test2').getAttribute('data-text')).toBeNull();
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeDataset(document.body.children, 'text');
        });

        expect(await page.locator('#test1').getAttribute('data-text')).toBeNull();
        expect(await page.locator('#test2').getAttribute('data-text')).toBeNull();
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeDataset([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'text');
        });

        expect(await page.locator('#test1').getAttribute('data-text')).toBeNull();
        expect(await page.locator('#test2').getAttribute('data-text')).toBeNull();
    });
});
