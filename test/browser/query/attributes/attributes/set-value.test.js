import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #setValue', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<input type="text" id="test1">' +
                '<input type="text" id="test2">' +
                '<textarea id="test3"></textarea>' +
                '<select id="test4"><option value="1">1</option><option value="2">2</option></select>';
        });
    });

    test('sets the input value for all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('input')
                    .setValue('Test');
            return [
                document.getElementById('test1').value,
                document.getElementById('test2').value,
            ];
        })).toEqual([
            'Test',
            'Test',
        ]);
    });

    test('works with textarea input nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('textarea')
                    .setValue('Test');
            return document.getElementById('test3').value;
        })).toBe('Test');
    });

    test('works with select input nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('select')
                    .setValue(2);
            return document.getElementById('test4').value;
        })).toBe('2');
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('input');
            return query === query.setValue('Test');
        })).toBe(true);
    });
});
