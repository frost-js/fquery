import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1"></div><div id="test2"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#setDataset', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('sets a dataset object for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setDataset('div', {
                testA: 'Test 1',
                testB: 'Test 2',
            });
        });

        await expect(page.locator('#test1')).toHaveAttribute('data-test-a', 'Test 1');
        await expect(page.locator('#test1')).toHaveAttribute('data-test-b', 'Test 2');
        await expect(page.locator('#test2')).toHaveAttribute('data-test-a', 'Test 1');
        await expect(page.locator('#test2')).toHaveAttribute('data-test-b', 'Test 2');
    });

    test('sets a dataset value for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setDataset('div', 'text', 'Test');
        });

        await expect(page.locator('#test1')).toHaveAttribute('data-text', 'Test');
        await expect(page.locator('#test2')).toHaveAttribute('data-text', 'Test');
    });

    test('formats boolean true values', async ({ page }) => {
        await page.evaluate((_) => {
            $.setDataset('#test1', 'true', true);
        });

        await expect(page.locator('#test1')).toHaveAttribute('data-true', 'true');
        expect(await page.locator('#test2').getAttribute('data-true')).toBeNull();
    });

    test('formats boolean false values', async ({ page }) => {
        await page.evaluate((_) => {
            $.setDataset('#test1', 'false', false);
        });

        await expect(page.locator('#test1')).toHaveAttribute('data-false', 'false');
        expect(await page.locator('#test2').getAttribute('data-false')).toBeNull();
    });

    test('formats boolean null values', async ({ page }) => {
        await page.evaluate((_) => {
            $.setDataset('#test1', 'null', null);
        });

        await expect(page.locator('#test1')).toHaveAttribute('data-null', 'null');
        expect(await page.locator('#test2').getAttribute('data-null')).toBeNull();
    });

    test('formats array values', async ({ page }) => {
        await page.evaluate((_) => {
            $.setDataset('#test1', 'array', [1, 2, 3]);
        });

        await expect(page.locator('#test1')).toHaveAttribute('data-array', '[1,2,3]');
        expect(await page.locator('#test2').getAttribute('data-array')).toBeNull();
    });

    test('formats object values', async ({ page }) => {
        await page.evaluate((_) => {
            $.setDataset('#test1', 'object', { a: 1 });
        });

        await expect(page.locator('#test1')).toHaveAttribute('data-object', '{"a":1}');
        expect(await page.locator('#test2').getAttribute('data-object')).toBeNull();
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setDataset(document.getElementById('test1'), 'text', 'Test');
        });

        await expect(page.locator('#test1')).toHaveAttribute('data-text', 'Test');
        expect(await page.locator('#test2').getAttribute('data-text')).toBeNull();
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setDataset(document.querySelectorAll('div'), 'text', 'Test');
        });

        await expect(page.locator('#test1')).toHaveAttribute('data-text', 'Test');
        await expect(page.locator('#test2')).toHaveAttribute('data-text', 'Test');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setDataset(document.body.children, 'text', 'Test');
        });

        await expect(page.locator('#test1')).toHaveAttribute('data-text', 'Test');
        await expect(page.locator('#test2')).toHaveAttribute('data-text', 'Test');
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setDataset([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'text', 'Test');
        });

        await expect(page.locator('#test1')).toHaveAttribute('data-text', 'Test');
        await expect(page.locator('#test2')).toHaveAttribute('data-text', 'Test');
    });
});
