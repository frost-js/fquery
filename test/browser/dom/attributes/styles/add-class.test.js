import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1"></div><div id="test2"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#addClass', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('adds a class to all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.addClass('div', 'test');
        });

        await expect(page.locator('#test1')).toHaveClass('test');
        await expect(page.locator('#test2')).toHaveClass('test');
    });

    test('parses classes from string', async ({ page }) => {
        await page.evaluate((_) => {
            $.addClass('div', 'test1 test2');
        });

        await expect(page.locator('#test1')).toHaveClass('test1 test2');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('parses classes from array', async ({ page }) => {
        await page.evaluate((_) => {
            $.addClass('div', [
                'test1',
                'test2',
            ]);
        });

        await expect(page.locator('#test1')).toHaveClass('test1 test2');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('parses classes from multiple arguments', async ({ page }) => {
        await page.evaluate((_) => {
            $.addClass('div', 'test1', ['test2']);
        });

        await expect(page.locator('#test1')).toHaveClass('test1 test2');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('works with empty strings', async ({ page }) => {
        await page.evaluate((_) => {
            $.addClass('div', '');
        });

        expect(await page.locator('#test1').getAttribute('class')).toBeNull();
        expect(await page.locator('#test2').getAttribute('class')).toBeNull();
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.addClass(document.getElementById('test1'), 'test');
        });

        await expect(page.locator('#test1')).toHaveClass('test');
        expect(await page.locator('#test2').getAttribute('class')).toBeNull();
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.addClass(document.querySelectorAll('div'), 'test');
        });

        await expect(page.locator('#test1')).toHaveClass('test');
        await expect(page.locator('#test2')).toHaveClass('test');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.addClass(document.body.children, 'test');
        });

        await expect(page.locator('#test1')).toHaveClass('test');
        await expect(page.locator('#test2')).toHaveClass('test');
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.addClass([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'test');
        });

        await expect(page.locator('#test1')).toHaveClass('test');
        await expect(page.locator('#test2')).toHaveClass('test');
    });
});
