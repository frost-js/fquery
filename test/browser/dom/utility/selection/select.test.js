import { selectTests, setup } from '#cases/utility/selection/select.js';
import { expect, test } from '#test';

test.describe('#select', () => {
    test.beforeEach(setup);

    selectTests((args) => {
        $.select(...args);
    });

    test.describe('form controls', () => {
        test('selects forms with a control named select', async ({ page }) => {
            expect(await page.evaluate((_) => {
                document.body.innerHTML = '<form><input name="select"></form>';
                const form = document.querySelector('form');
                $.select('form');
                return $.getSelection()[0] === form;
            })).toBe(true);
        });

        test('creates a selection on an input node', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.select('#input');
                document.execCommand('cut');
                return document.getElementById('input').value;
            })).toBe('');
        });

        test('creates a selection on a textarea node', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.select('#textarea');
                document.execCommand('cut');
                return document.getElementById('textarea').value;
            })).toBe('');
        });
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.select(document.getElementById('div1'));
                const selection = document.getSelection();
                const range = selection.getRangeAt(0);
                return range.toString();
            })).toBe('Test 1');
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.select(document.querySelectorAll('.select'));
                const selection = document.getSelection();
                const range = selection.getRangeAt(0);
                return range.toString();
            })).toBe('Test 1');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.select(document.getElementById('select').children);
                const selection = document.getSelection();
                const range = selection.getRangeAt(0);
                return range.toString();
            })).toBe('Test 1');
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.select([
                    document.getElementById('div1'),
                    document.getElementById('div2'),
                ]);
                const selection = document.getSelection();
                const range = selection.getRangeAt(0);
                return range.toString();
            })).toBe('Test 1');
        });
    });
});
