import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #setProperty', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<input type="text" id="test1">' +
                '<input type="number" id="test2">';
        });
    });

    test('sets a properties object for all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $('input')
                    .setProperty({
                        test1: 'Test 1',
                        test2: 'Test 2',
                    });
            return [
                element1.test1,
                element1.test2,
                element2.test1,
                element2.test2,
            ];
        })).toEqual([
            'Test 1',
            'Test 2',
            'Test 1',
            'Test 2',
        ]);
    });

    test('sets a property for all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('input')
                    .setProperty('test', 'Test');
            return [
                document.getElementById('test1').test,
                document.getElementById('test2').test,
            ];
        })).toEqual([
            'Test',
            'Test',
        ]);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('input');
            return query === query.setProperty('test', 'Test');
        })).toBe(true);
    });
});
