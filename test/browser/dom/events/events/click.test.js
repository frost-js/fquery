import { clickTests, setup } from '#cases/events/events/click.js';
import { expect, test } from '#test';

test.describe('#click', () => {
    test.beforeEach(setup);

    clickTests(() => $.click);

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result;
                const element = document.getElementById('test1');
                element.addEventListener('click', () => {
                    result = true;
                });
                $.click(document.getElementById('test1'));
                return result;
            })).toBe(true);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result;
                const element = document.getElementById('test1');
                element.addEventListener('click', () => {
                    result = true;
                });
                $.click(document.querySelectorAll('a'));
                return result;
            })).toBe(true);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result;
                const element = document.getElementById('test1');
                element.addEventListener('click', () => {
                    result = true;
                });
                $.click(document.body.children);
                return result;
            })).toBe(true);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result;
                const element = document.getElementById('test1');
                element.addEventListener('click', () => {
                    result = true;
                });
                $.click([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ]);
                return result;
            })).toBe(true);
        });
    });
});
