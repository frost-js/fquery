import { setStyleTests, setup } from '#cases/attributes/styles/set-style.js';
import { expect, test } from '#test';

test.describe('QuerySet #setStyle', () => {
    test.beforeEach(setup);

    setStyleTests(([nodes, ...args]) => {
        $(nodes).setStyle(...args);
    });

    test('sets styles on forms with a control whose id is style', async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML = '<form id="form"><input id="style"></form>';
            $('form').setStyle('color', 'red');
        });

        await expect(page.locator('#form')).toHaveAttribute('style', 'color: red;');
    });

    test('sets custom properties', async ({ page }) => {
        await page.evaluate((_) => {
            $('div')
                .setStyle('--brandColor', 'red')
                .setStyle({ '--spacing-size': 100 });
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', '--brandColor: red; --spacing-size: 100;');
        await expect(page.locator('#test2')).toHaveAttribute('style', '--brandColor: red; --spacing-size: 100;');
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.setStyle('display', 'block');
        })).toBe(true);
    });
});
