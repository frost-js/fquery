import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<input type="number" id="test1"><input type="number" id="test2">';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#setAttribute', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('sets an attributes object for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setAttribute('input', {
                min: '1',
                max: '10',
            });
        });

        await expect(page.locator('#test1')).toHaveAttribute('min', '1');
        await expect(page.locator('#test1')).toHaveAttribute('max', '10');
        await expect(page.locator('#test2')).toHaveAttribute('min', '1');
        await expect(page.locator('#test2')).toHaveAttribute('max', '10');
    });

    test('sets an attribute for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setAttribute('input', 'placeholder', '123');
        });

        await expect(page.locator('#test1')).toHaveAttribute('placeholder', '123');
        await expect(page.locator('#test2')).toHaveAttribute('placeholder', '123');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setAttribute(document.getElementById('test1'), 'placeholder', '123');
        });

        await expect(page.locator('#test1')).toHaveAttribute('placeholder', '123');
        expect(await page.locator('#test2').getAttribute('placeholder')).toBeNull();
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setAttribute(document.querySelectorAll('input'), 'placeholder', '123');
        });

        await expect(page.locator('#test1')).toHaveAttribute('placeholder', '123');
        await expect(page.locator('#test2')).toHaveAttribute('placeholder', '123');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setAttribute(document.body.children, 'placeholder', '123');
        });

        await expect(page.locator('#test1')).toHaveAttribute('placeholder', '123');
        await expect(page.locator('#test2')).toHaveAttribute('placeholder', '123');
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setAttribute([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'placeholder', '123');
        });

        await expect(page.locator('#test1')).toHaveAttribute('placeholder', '123');
        await expect(page.locator('#test2')).toHaveAttribute('placeholder', '123');
    });
});
