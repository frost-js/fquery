import { setStyleTests, setup } from '#cases/attributes/styles/set-style.js';
import { expect, test } from '#test';

test.describe('QuerySet #setStyle', () => {
    test.beforeEach(setup);

    setStyleTests(() => (nodes, ...args) => {
        $(nodes).setStyle(...args);
    });

    test('sets styles on forms with a control whose id is style', async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML = '<form id="form"><input id="style"></form>';
            $('form').setStyle('color', 'red');
        });

        await expect(page.locator('#form')).toHaveAttribute('style', 'color: red;');
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.setStyle('display', 'block');
        })).toBe(true);
    });
});
