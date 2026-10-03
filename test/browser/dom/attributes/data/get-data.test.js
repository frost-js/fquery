import { getDataTests, setup } from '#cases/attributes/data/get-data.js';
import { expect, test } from '#test';

test.describe('#getData', () => {
    test.beforeEach(setup);

    getDataTests((args) => $.getData(...args));

    for (const key of ['constructor', 'toString', '__proto__']) {
        test(`does not return an inherited ${key} property`, async ({ page }) => {
            expect(await page.evaluate((key) =>
                $.getData('div', key) === undefined, key)).toBe(true);
        });
    }

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.getData(document.getElementById('test1'), 'test'))).toBe('Test 1');
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.getData(document.querySelectorAll('div'), 'test'))).toBe('Test 1');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.getData(document.body.children, 'test'))).toBe('Test 1');
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate(() => {
            const fragment = document.createDocumentFragment();
            $.setData(fragment, 'test', 'Test 2');
            return $.getData(fragment, 'test');
        })).toBe('Test 2');
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate(() => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.setData(shadow, 'test', 'Test 2');
            return $.getData(shadow, 'test');
        })).toBe('Test 2');
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate(() => {
            $.setData(document, 'test', 'Test 2');
            return $.getData(document, 'test');
        })).toBe('Test 2');
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate(() => {
            $.setData(window, 'test', 'Test 2');
            return $.getData(window, 'test');
        })).toBe('Test 2');
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.getData([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'test'))).toBe('Test 1');
    });
});
