import { setDataTests, setup } from '#cases/attributes/data/set-data.js';
import { expect, test } from '#test';

test.describe('#setData', () => {
    test.beforeEach(setup);

    setDataTests((args) => $.setData(...args));

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.setData(document.getElementById('test1'), 'test', 'Test 1');
                return $.getData('#test1');
            })).toEqual({
                test: 'Test 1',
            });
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.setData(document.querySelectorAll('div'), 'test', 'Test 1');
                return [
                    $.getData('#test1'),
                    $.getData('#test2'),
                ];
            })).toEqual([
                {
                    test: 'Test 1',
                },
                {
                    test: 'Test 1',
                },
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.setData(document.body.children, 'test', 'Test 1');
                return [
                    $.getData('#test1'),
                    $.getData('#test2'),
                ];
            })).toEqual([
                {
                    test: 'Test 1',
                },
                {
                    test: 'Test 1',
                },
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const fragment = document.createDocumentFragment();
                $.setData(fragment, 'test', 'Test 1');
                return $.getData(fragment);
            })).toEqual({
                test: 'Test 1',
            });
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                $.setData(shadow, 'test', 'Test 1');
                return $.getData(shadow);
            })).toEqual({
                test: 'Test 1',
            });
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.setData(document, 'test', 'Test 1');
                return $.getData(document);
            })).toEqual({
                test: 'Test 1',
            });
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.setData(window, 'test', 'Test 1');
                return $.getData(window);
            })).toEqual({
                test: 'Test 1',
            });
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.setData([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ], 'test', 'Test 1');
                return [
                    $.getData('#test1'),
                    $.getData('#test2'),
                ];
            })).toEqual([
                {
                    test: 'Test 1',
                },
                {
                    test: 'Test 1',
                },
            ]);
        });
    });
});
