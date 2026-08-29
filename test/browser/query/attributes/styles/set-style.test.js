import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1"></div><div id="test2"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #setStyle', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('sets a styles object for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').setStyle({
                display: 'block',
                width: '100%',
                height: '100px',
                opacity: 0.5,
            });
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block; width: 100%; height: 100px; opacity: 0.5;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: block; width: 100%; height: 100px; opacity: 0.5;');
    });

    test('sets a style value for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').setStyle('display', 'block');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: block;');
    });

    test('sets custom properties', async ({ page }) => {
        await page.evaluate((_) => {
            $('div')
                .setStyle('--theme-color', 'red')
                .setStyle({ '--spacing-size': 100 });
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', '--theme-color: red; --spacing-size: 100;');
        await expect(page.locator('#test2')).toHaveAttribute('style', '--theme-color: red; --spacing-size: 100;');
    });

    test('converts number values to pixels', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').setStyle('width', '100');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100px;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'width: 100px;');
    });

    test('converts style object number values to pixels', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').setStyle({
                width: 100,
                height: 100,
            });
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100px; height: 100px;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'width: 100px; height: 100px;');
    });

    test('does not convert number values with units to pixels', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').setStyle('width', '100%');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'width: 100%;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'width: 100%;');
    });

    test('does not convert number values for CSS number properties', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').setStyle('font-weight', '500');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'font-weight: 500;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'font-weight: 500;');
    });

    test('sets a style object for all nodes with important', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').setStyle({
                display: 'block',
                width: '100%',
            }, null, { important: true });
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block !important; width: 100% !important;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: block !important; width: 100% !important;');
    });

    test('sets a style value for all nodes with important', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').setStyle('display', 'block', { important: true });
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: block !important;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: block !important;');
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.setStyle('display', 'block');
        })).toBe(true);
    });
});
