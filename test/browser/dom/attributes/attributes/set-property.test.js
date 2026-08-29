import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#setProperty', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<input type="text" id="test1">' +
                '<input type="number" id="test2">';
        });
    });

    test('sets a properties object for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setProperty('input', {
                test1: 'Test 1',
                test2: 'Test 2',
            });
        });

        expect(await page.locator('#test1').evaluate((element) => element.test1))
            .toBe('Test 1');
        expect(await page.locator('#test1').evaluate((element) => element.test2))
            .toBe('Test 2');
        expect(await page.locator('#test2').evaluate((element) => element.test1))
            .toBe('Test 1');
        expect(await page.locator('#test2').evaluate((element) => element.test2))
            .toBe('Test 2');
    });

    test('sets a property for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setProperty('input', 'test', 'Test');
        });

        expect(await page.locator('#test1').evaluate((element) => element.test))
            .toBe('Test');
        expect(await page.locator('#test2').evaluate((element) => element.test))
            .toBe('Test');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((_) => {
            const element = document.getElementById('test1');
            $.setProperty(
                element,
                'test',
                'Test',
            );
        });

        expect(await page.locator('#test1').evaluate((element) => element.test))
            .toBe('Test');
        expect(await page.locator('#test2').evaluate((element) => element.test))
            .toBeUndefined();
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setProperty(
                document.querySelectorAll('input'),
                'test',
                'Test',
            );
        });

        expect(await page.locator('#test1').evaluate((element) => element.test))
            .toBe('Test');
        expect(await page.locator('#test2').evaluate((element) => element.test))
            .toBe('Test');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.setProperty(
                document.body.children,
                'test',
                'Test',
            );
        });

        expect(await page.locator('#test1').evaluate((element) => element.test))
            .toBe('Test');
        expect(await page.locator('#test2').evaluate((element) => element.test))
            .toBe('Test');
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.setProperty([
                element1,
                element2,
            ], 'test', 'Test');
        });

        expect(await page.locator('#test1').evaluate((element) => element.test))
            .toBe('Test');
        expect(await page.locator('#test2').evaluate((element) => element.test))
            .toBe('Test');
    });
});
