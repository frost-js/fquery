import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1"></div><div id="test2"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #addClass', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('adds a class to all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').addClass('test');
        });

        await expect(page.locator('#test1')).toHaveClass('test');
        await expect(page.locator('#test2')).toHaveClass('test');
    });

    test('parses classes from string', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').addClass('test1 test2');
        });

        await expect(page.locator('#test1')).toHaveClass('test1 test2');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('parses classes from array', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').addClass([
                'test1',
                'test2',
            ]);
        });

        await expect(page.locator('#test1')).toHaveClass('test1 test2');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('parses classes from multiple arguments', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').addClass('test1', ['test2']);
        });

        await expect(page.locator('#test1')).toHaveClass('test1 test2');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('works with empty strings', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').addClass('');
        });

        expect(await page.locator('#test1').getAttribute('class')).toBeNull();
        expect(await page.locator('#test2').getAttribute('class')).toBeNull();
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.addClass('test');
        })).toBe(true);
    });
});
