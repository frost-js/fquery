import { selectTests, setup } from '#cases/utility/selection/select.js';
import { expect, test } from '#test';

test.describe('#select', () => {
    test.beforeEach(setup);

    selectTests(() => $.select);

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.select(document.getElementById('div1'));
                const selection = document.getSelection();
                const range = selection.getRangeAt(0);
                return range.toString();
            })).toBe('Test 1');
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.select(document.querySelectorAll('.select'));
                const selection = document.getSelection();
                const range = selection.getRangeAt(0);
                return range.toString();
            })).toBe('Test 1');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.select(document.getElementById('select').children);
                const selection = document.getSelection();
                const range = selection.getRangeAt(0);
                return range.toString();
            })).toBe('Test 1');
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
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
