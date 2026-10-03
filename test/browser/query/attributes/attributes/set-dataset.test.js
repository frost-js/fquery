import { setDatasetTests, setup } from '#cases/attributes/attributes/set-dataset.js';
import { expect, test } from '#test';

test.describe('QuerySet #setDataset', () => {
    test.beforeEach(setup);

    setDatasetTests(([nodes, ...args]) => {
        $(nodes).setDataset(...args);
    });

    test('sets dataset values on forms with a control whose id is dataset', async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML = '<form id="form"><input id="dataset"></form>';
            $('form').setDataset('test', 'Test');
        });

        await expect(page.locator('#form')).toHaveAttribute('data-test', 'Test');
        expect(await page.locator('input').getAttribute('data-test')).toBeNull();
    });

    test('returns the QuerySet', async ({ page }) => {
        const isSameQuerySet = await page.evaluate(() => {
            const query = $('div');

            return query === query.setDataset('text', 'Test');
        });

        expect(isSameQuerySet).toBe(true);
    });
});
