import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#click', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>';
        });
    });

    test('triggers a click event on the first node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result;
            const element = document.getElementById('test1');
            element.addEventListener('click', (_) => {
                result = true;
            });
            $.click('a');
            return result;
        })).toBe(true);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result;
            const element = document.getElementById('test1');
            element.addEventListener('click', (_) => {
                result = true;
            });
            $.click(
                document.getElementById('test1'),
            );
            return result;
        })).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result;
            const element = document.getElementById('test1');
            element.addEventListener('click', (_) => {
                result = true;
            });
            $.click(
                document.querySelectorAll('a'),
            );
            return result;
        })).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result;
            const element = document.getElementById('test1');
            element.addEventListener('click', (_) => {
                result = true;
            });
            $.click(
                document.body.children,
            );
            return result;
        })).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result;
            const element = document.getElementById('test1');
            element.addEventListener('click', (_) => {
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
