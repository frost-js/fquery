import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#removeProperty', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<input type="checkbox" id="test1">' +
                '<input type="checkbox" id="test2">';
            document.getElementById('test1').test = 'Test 1';
            document.getElementById('test2').test = 'Test 2';
        });
    });

    test('removes a property for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeProperty('input', 'test');
        });

        expect(await page.locator('#test1').evaluate((element) => element.test))
            .toBeUndefined();
        expect(await page.locator('#test2').evaluate((element) => element.test))
            .toBeUndefined();
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((_) => {
            const element = document.getElementById('test1');
            $.removeProperty(
                element,
                'test',
            );
        });

        expect(await page.locator('#test1').evaluate((element) => element.test))
            .toBeUndefined();
        expect(await page.locator('#test2').evaluate((element) => element.test))
            .toBe('Test 2');
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeProperty(
                document.querySelectorAll('input'),
                'test',
            );
        });

        expect(await page.locator('#test1').evaluate((element) => element.test))
            .toBeUndefined();
        expect(await page.locator('#test2').evaluate((element) => element.test))
            .toBeUndefined();
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeProperty(
                document.body.children,
                'test',
            );
        });

        expect(await page.locator('#test1').evaluate((element) => element.test))
            .toBeUndefined();
        expect(await page.locator('#test2').evaluate((element) => element.test))
            .toBeUndefined();
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.removeProperty([
                element1,
                element2,
            ], 'test');
        });

        expect(await page.locator('#test1').evaluate((element) => element.test))
            .toBeUndefined();
        expect(await page.locator('#test2').evaluate((element) => element.test))
            .toBeUndefined();
    });
});
