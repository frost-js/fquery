import { selectAllTests, setup } from '#cases/utility/selection/select-all.js';
import { expect, test } from '#test';

test.describe('#selectAll', () => {
    test.beforeEach(setup);

    selectAllTests((args) => {
        $.selectAll(...args);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.selectAll(document.getElementById('div3'));
                const selection = document.getSelection();
                const range = selection.getRangeAt(0);
                return range.toString();
            })).toBe('Test 3');
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.selectAll(document.querySelectorAll('.select'));
                const selection = document.getSelection();
                const range = selection.getRangeAt(0);
                return range.toString();
            })).toBe('Test 2Test 3Test 4');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.selectAll(document.getElementById('select').children);
                const selection = document.getSelection();
                const range = selection.getRangeAt(0);
                return range.toString();
            })).toBe('Test 1Test 2Test 3Test 4Test 5');
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.selectAll([
                    document.getElementById('div4'),
                    document.getElementById('div2'),
                ]);
                const selection = document.getSelection();
                const range = selection.getRangeAt(0);
                return range.toString();
            })).toBe('Test 2Test 3Test 4');
        });
    });
});
