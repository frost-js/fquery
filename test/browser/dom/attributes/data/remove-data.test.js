import { removeDataTests, setup } from '#cases/attributes/data/remove-data.js';
import { expect, test } from '#test';

test.describe('#removeData', () => {
    test.beforeEach(setup);

    removeDataTests((args) => {
        $.removeData(...args);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.removeData(document.getElementById('test1'), 'testA');
            return $.getData('#test1');
        })).toEqual({
            testB: 'Test 2',
        });
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeData(document.querySelectorAll('div'), 'testA');
        });

        expect(await page.evaluate((_) => $.getData('#test1'))).toEqual({
            testB: 'Test 2',
        });
        expect(await page.evaluate((_) => $.getData('#test2'))).toEqual({
            testB: 'Test 2',
        });
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeData(document.body.children, 'testA');
        });

        expect(await page.evaluate((_) => $.getData('#test1'))).toEqual({
            testB: 'Test 2',
        });
        expect(await page.evaluate((_) => $.getData('#test2'))).toEqual({
            testB: 'Test 2',
        });
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            $.setData(fragment, {
                testA: 'Test 1',
                testB: 'Test 2',
            });
            $.removeData(fragment, 'testA');
            return $.getData(fragment);
        })).toEqual({
            testB: 'Test 2',
        });
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.setData(shadow, {
                testA: 'Test 1',
                testB: 'Test 2',
            });
            $.removeData(shadow, 'testA');
            return $.getData(shadow);
        })).toEqual({
            testB: 'Test 2',
        });
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(document, {
                testA: 'Test 1',
                testB: 'Test 2',
            });
            $.removeData(document, 'testA');
            return $.getData(document);
        })).toEqual({
            testB: 'Test 2',
        });
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(window, {
                testA: 'Test 1',
                testB: 'Test 2',
            });
            $.removeData(window, 'testA');
            return $.getData(window);
        })).toEqual({
            testB: 'Test 2',
        });
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.removeData([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'testA');
        });

        expect(await page.evaluate((_) => $.getData('#test1'))).toEqual({
            testB: 'Test 2',
        });
        expect(await page.evaluate((_) => $.getData('#test2'))).toEqual({
            testB: 'Test 2',
        });
    });
});
