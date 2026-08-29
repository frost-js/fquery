import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1" class="test1 test2"></div><div id="test2"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #toggleClass', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('toggles a class for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').toggleClass('test1');
        });

        await expect(page.locator('#test1')).toHaveClass('test2');
        await expect(page.locator('#test2')).toHaveClass('test1');
    });

    test('parses classes from string', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').toggleClass('test1 test2');
        });

        await expect(page.locator('#test1')).toHaveAttribute('class', '');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('parses classes from array', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').toggleClass([
                'test1',
                'test2',
            ]);
        });

        await expect(page.locator('#test1')).toHaveAttribute('class', '');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('parses classes from multiple arguments', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').toggleClass('test1', ['test2']);
        });

        await expect(page.locator('#test1')).toHaveAttribute('class', '');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('works with empty strings', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').toggleClass('');
        });

        await expect(page.locator('#test1')).toHaveClass('test1 test2');
        expect(await page.locator('#test2').getAttribute('class')).toBeNull();
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.toggleClass('test1');
        })).toBe(true);
    });
});
