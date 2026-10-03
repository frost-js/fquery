import { blurTests, setup } from '#cases/events/events/blur.js';
import { expect, test } from '#test';

test.describe('#blur', () => {
    test.beforeEach(setup);

    blurTests(() => $.blur);

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result;
                const element = document.getElementById('test1');
                element.addEventListener('blur', () => {
                    result = true;
                });
                element.focus();
                $.blur(document.getElementById('test1'));
                return result;
            })).toBe(true);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result;
                const element = document.getElementById('test1');
                element.addEventListener('blur', () => {
                    result = true;
                });
                element.focus();
                $.blur(document.querySelectorAll('input'));
                return result;
            })).toBe(true);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result;
                const element = document.getElementById('test1');
                element.addEventListener('blur', () => {
                    result = true;
                });
                element.focus();
                $.blur(document.body.children);
                return result;
            })).toBe(true);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result;
                const element = document.getElementById('test1');
                element.addEventListener('blur', () => {
                    result = true;
                });
                element.focus();
                $.blur([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ]);
                return result;
            })).toBe(true);
        });
    });
});
