import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1" class="test1 test2"></div><div id="test2" class="test1 test2"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#removeClass', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('removes a class from all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeClass('div', 'test1');
        });

        await expect(page.locator('#test1')).toHaveClass('test2');
        await expect(page.locator('#test2')).toHaveClass('test2');
    });

    test('parses classes from string', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeClass('div', 'test1 test2');
        });

        await expect(page.locator('#test1')).toHaveAttribute('class', '');
        await expect(page.locator('#test2')).toHaveAttribute('class', '');
    });

    test('parses classes from array', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeClass('div', [
                'test1',
                'test2',
            ]);
        });

        await expect(page.locator('#test1')).toHaveAttribute('class', '');
        await expect(page.locator('#test2')).toHaveAttribute('class', '');
    });

    test('parses classes from multiple arguments', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeClass('div', 'test1', ['test2']);
        });

        await expect(page.locator('#test1')).toHaveAttribute('class', '');
        await expect(page.locator('#test2')).toHaveAttribute('class', '');
    });

    test('works with empty strings', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeClass('div', '');
        });

        await expect(page.locator('#test1')).toHaveClass('test1 test2');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeClass(document.getElementById('test1'), 'test1');
        });

        await expect(page.locator('#test1')).toHaveClass('test2');
        await expect(page.locator('#test2')).toHaveClass('test1 test2');
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeClass(document.querySelectorAll('div'), 'test1');
        });

        await expect(page.locator('#test1')).toHaveClass('test2');
        await expect(page.locator('#test2')).toHaveClass('test2');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeClass(document.body.children, 'test1');
        });

        await expect(page.locator('#test1')).toHaveClass('test2');
        await expect(page.locator('#test2')).toHaveClass('test2');
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeClass([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'test1');
        });

        await expect(page.locator('#test1')).toHaveClass('test2');
        await expect(page.locator('#test2')).toHaveClass('test2');
    });
});
