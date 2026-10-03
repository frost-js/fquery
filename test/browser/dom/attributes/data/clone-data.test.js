import { cloneDataTests, setup } from '#cases/attributes/data/clone-data.js';
import { expect, test } from '#test';

test.describe('#cloneData', () => {
    test.beforeEach(setup);

    cloneDataTests(([nodes, other]) => {
        $.cloneData(nodes, other);
    });

    test.describe('source inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.cloneData(document.getElementById('test1'), '[data-toggle="noData"]');
                return [
                    $.getData('#test3'),
                    $.getData('#test4'),
                ];
            })).toEqual([
                {
                    test1: 'Test 1',
                },
                {
                    test1: 'Test 1',
                },
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.cloneData(document.querySelectorAll('[data-toggle="data"]'), '[data-toggle="noData"]');
                return [
                    $.getData('#test3'),
                    $.getData('#test4'),
                ];
            })).toEqual([
                {
                    test1: 'Test 1',
                    test2: 'Test 2',
                },
                {
                    test1: 'Test 1',
                    test2: 'Test 2',
                },
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.cloneData(document.getElementById('dataParent').children, '[data-toggle="noData"]');
                return [
                    $.getData('#test3'),
                    $.getData('#test4'),
                ];
            })).toEqual([
                {
                    test1: 'Test 1',
                    test2: 'Test 2',
                },
                {
                    test1: 'Test 1',
                    test2: 'Test 2',
                },
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const fragment = document.createDocumentFragment();
                $.setData(fragment, 'test', 'Test 1');
                $.cloneData(fragment, '[data-toggle="noData"]');
                return [
                    $.getData('#test3'),
                    $.getData('#test4'),
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

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                $.setData(shadow, 'test', 'Test 1');
                $.cloneData(shadow, '[data-toggle="noData"]');
                return [
                    $.getData('#test3'),
                    $.getData('#test4'),
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

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.setData(document, 'test', 'Test 1');
                $.cloneData(document, '[data-toggle="noData"]');
                return [
                    $.getData('#test3'),
                    $.getData('#test4'),
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

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.setData(window, 'test', 'Test 1');
                $.cloneData(window, '[data-toggle="noData"]');
                return [
                    $.getData('#test3'),
                    $.getData('#test4'),
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

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.cloneData([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ], '[data-toggle="noData"]');
                return [
                    $.getData('#test3'),
                    $.getData('#test4'),
                ];
            })).toEqual([
                {
                    test1: 'Test 1',
                    test2: 'Test 2',
                },
                {
                    test1: 'Test 1',
                    test2: 'Test 2',
                },
            ]);
        });
    });

    test.describe('destination inputs', () => {
        test('works with HTMLElement other nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.cloneData('[data-toggle="data"]', document.getElementById('test3'));
                return $.getData('#test3');
            })).toEqual({
                test1: 'Test 1',
                test2: 'Test 2',
            });
        });

        test('works with NodeList other nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.cloneData('[data-toggle="data"]', document.querySelectorAll('[data-toggle="noData"]'));
                return [
                    $.getData('#test3'),
                    $.getData('#test4'),
                ];
            })).toEqual([
                {
                    test1: 'Test 1',
                    test2: 'Test 2',
                },
                {
                    test1: 'Test 1',
                    test2: 'Test 2',
                },
            ]);
        });

        test('works with HTMLCollection other nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.cloneData('[data-toggle="data"]', document.getElementById('noDataParent').children);
                return [
                    $.getData('#test3'),
                    $.getData('#test4'),
                ];
            })).toEqual([
                {
                    test1: 'Test 1',
                    test2: 'Test 2',
                },
                {
                    test1: 'Test 1',
                    test2: 'Test 2',
                },
            ]);
        });

        test('works with DocumentFragment other nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const fragment = document.createDocumentFragment();
                $.cloneData('[data-toggle="data"]', fragment);
                return $.getData(fragment);
            })).toEqual({
                test1: 'Test 1',
                test2: 'Test 2',
            });
        });

        test('works with ShadowRoot other nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                $.cloneData('[data-toggle="data"]', shadow);
                return $.getData(shadow);
            })).toEqual({
                test1: 'Test 1',
                test2: 'Test 2',
            });
        });

        test('works with Document other nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.cloneData('[data-toggle="data"]', document);
                return $.getData(document);
            })).toEqual({
                test1: 'Test 1',
                test2: 'Test 2',
            });
        });

        test('works with Window other nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.cloneData('[data-toggle="data"]', window);
                return $.getData(window);
            })).toEqual({
                test1: 'Test 1',
                test2: 'Test 2',
            });
        });

        test('works with array other nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.cloneData('[data-toggle="data"]', [
                    document.getElementById('test3'),
                    document.getElementById('test4'),
                ]);
                return [
                    $.getData('#test3'),
                    $.getData('#test4'),
                ];
            })).toEqual([
                {
                    test1: 'Test 1',
                    test2: 'Test 2',
                },
                {
                    test1: 'Test 1',
                    test2: 'Test 2',
                },
            ]);
        });
    });
});
