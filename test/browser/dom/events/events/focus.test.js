import { focusTests, setup } from '#cases/events/events/focus.js';
import { expect, test } from '#test';

test.describe('#focus', () => {
    test.beforeEach(setup);

    focusTests(() => $.focus);

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result;
                const element = document.getElementById('test1');
                element.addEventListener('focus', () => {
                    result = true;
                });
                $.focus(document.getElementById('test1'));
                return result;
            })).toBe(true);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result;
                const element = document.getElementById('test1');
                element.addEventListener('focus', () => {
                    result = true;
                });
                $.focus(document.querySelectorAll('input'));
                return result;
            })).toBe(true);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result;
                const element = document.getElementById('test1');
                element.addEventListener('focus', () => {
                    result = true;
                });
                $.focus(document.body.children);
                return result;
            })).toBe(true);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result;
                const element = document.getElementById('test1');
                element.addEventListener('focus', () => {
                    result = true;
                });
                $.focus([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ]);
                return result;
            })).toBe(true);
        });
    });
});
