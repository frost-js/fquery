import { selectTests, setup } from '#cases/utility/selection/select.js';
import { expect, test } from '#test';

test.describe('QuerySet #select', () => {
    test.beforeEach(setup);

    selectTests(([nodes, ...args]) => {
        $(nodes).select(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('.select');
            return query === query.select();
        })).toBe(true);
    });

    test.describe('form controls', () => {
        test('selects forms with a control named select', async ({ page }) => {
            expect(await page.evaluate((_) => {
                document.body.innerHTML = '<form><input name="select"></form>';
                const form = document.querySelector('form');
                $('form').select();
                return $.getSelection()[0] === form;
            })).toBe(true);
        });

        test('creates a selection on an input node', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#input').select();
                document.execCommand('cut');
                return document.getElementById('input').value;
            })).toBe('');
        });

        test('creates a selection on a textarea node', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#textarea').select();
                document.execCommand('cut');
                return document.getElementById('textarea').value;
            })).toBe('');
        });
    });
});
