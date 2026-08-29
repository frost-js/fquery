import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#focus', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<input type="text" id="test1">' +
                '<input type="text" id="test2">';
        });
    });

    test('triggers a focus event on the first node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result;
            const element = document.getElementById('test1');
            element.addEventListener('focus', (_) => {
                result = true;
            });
            $.focus('input');
            return result;
        })).toBe(true);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result;
            const element = document.getElementById('test1');
            element.addEventListener('focus', (_) => {
                result = true;
            });
            $.focus(
                document.getElementById('test1'),
            );
            return result;
        })).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result;
            const element = document.getElementById('test1');
            element.addEventListener('focus', (_) => {
                result = true;
            });
            $.focus(
                document.querySelectorAll('input'),
            );
            return result;
        })).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result;
            const element = document.getElementById('test1');
            element.addEventListener('focus', (_) => {
                result = true;
            });
            $.focus(
                document.body.children,
            );
            return result;
        })).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result;
            const element = document.getElementById('test1');
            element.addEventListener('focus', (_) => {
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
