import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#setValue', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<input type="text" id="test1">' +
                '<input type="text" id="test2">' +
                '<textarea id="test3"></textarea>' +
                '<select id="test4"><option value="1">1</option><option value="2">2</option></select>';
        });
    });

    test('sets the input value for all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setValue('input', 'Test');
            return [
                document.getElementById('test1').value,
                document.getElementById('test2').value,
            ];
        })).toEqual([
            'Test',
            'Test',
        ]);
    });

    test('works with textarea input nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setValue('textarea', 'Test');
            return document.getElementById('test3').value;
        })).toBe('Test');
    });

    test('works with select input nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setValue('select', 2);
            return document.getElementById('test4').value;
        })).toBe('2');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const element = document.getElementById('test1');
            $.setValue(element, 'Test');
            return [
                element.value,
                document.getElementById('test2').value,
            ];
        })).toEqual([
            'Test',
            '',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setValue(
                document.querySelectorAll('input'),
                'Test',
            );
            return [
                document.getElementById('test1').value,
                document.getElementById('test2').value,
            ];
        })).toEqual([
            'Test',
            'Test',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setValue(
                document.body.children,
                'Test',
            );
            return [
                document.getElementById('test1').value,
                document.getElementById('test2').value,
            ];
        })).toEqual([
            'Test',
            'Test',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.setValue([
                element1,
                element2,
            ], 'Test');
            return [
                element1.value,
                element2.value,
            ];
        })).toEqual([
            'Test',
            'Test',
        ]);
    });
});
