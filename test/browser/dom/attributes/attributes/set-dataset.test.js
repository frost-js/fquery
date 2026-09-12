import { setDatasetTests, setup } from '#cases/attributes/attributes/set-dataset.js';
import { expect, test } from '#test';

test.describe('#setDataset', () => {
    test.beforeEach(setup);

    setDatasetTests((args) => {
        $.setDataset(...args);
    });

    test('sets dataset values on forms with a control whose name is dataset', async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML = '<form id="form"><input name="dataset"></form>';
            $.setDataset('form', 'test', 'Test');
        });

        await expect(page.locator('#form')).toHaveAttribute('data-test', 'Test');
        expect(await page.locator('input').getAttribute('data-test')).toBeNull();
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
