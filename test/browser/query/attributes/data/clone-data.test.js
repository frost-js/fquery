import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #cloneData', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="dataParent">' +
                '<div id="test1" data-toggle="data"></div>' +
                '<div id="test2" data-toggle="data"></div>' +
                '</div>' +
                '<div id="noDataParent">' +
                '<div id="test3" data-toggle="noData"></div>' +
                '<div id="test4" data-toggle="noData"></div>' +
                '</div>';
            $.setData('#test1', 'test1', 'Test 1');
            $.setData('#test2', 'test2', 'Test 2');
        });
    });

    test('clones data from all nodes to all other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('[data-toggle="data"]')
                    .cloneData('[data-toggle="noData"]');
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

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('[data-toggle="data"]');
            return query === query.cloneData('[data-toggle="noData"]');
        })).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            $.setData(fragment, 'test', 'Test 1');
            $(fragment)
                    .cloneData('[data-toggle="noData"]');
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
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.setData(shadow, 'test', 'Test 1');
            $(shadow)
                    .cloneData('[data-toggle="noData"]');
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
        expect(await page.evaluate((_) => {
            $.setData(document, 'test', 'Test 1');
            $(document)
                    .cloneData('[data-toggle="noData"]');
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
        expect(await page.evaluate((_) => {
            $.setData(window, 'test', 'Test 1');
            $(window)
                    .cloneData('[data-toggle="noData"]');
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

    test('works with HTMLElement other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('[data-toggle="data"]')
                    .cloneData(
                        document.getElementById('test3'),
                    );
            return $.getData('#test3');
        })).toEqual({
            test1: 'Test 1',
            test2: 'Test 2',
        });
    });

    test('works with NodeList other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('[data-toggle="data"]')
                    .cloneData(
                        document.querySelectorAll('[data-toggle="noData"]'),
                    );
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
        expect(await page.evaluate((_) => {
            $('[data-toggle="data"]')
                    .cloneData(
                        document.getElementById('noDataParent').children,
                    );
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
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            $('[data-toggle="data"]')
                    .cloneData(fragment);
            return $.getData(fragment);
        })).toEqual({
            test1: 'Test 1',
            test2: 'Test 2',
        });
    });

    test('works with ShadowRoot other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $('[data-toggle="data"]')
                    .cloneData(shadow);
            return $.getData(shadow);
        })).toEqual({
            test1: 'Test 1',
            test2: 'Test 2',
        });
    });

    test('works with Document other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('[data-toggle="data"]')
                    .cloneData(document);
            return $.getData(document);
        })).toEqual({
            test1: 'Test 1',
            test2: 'Test 2',
        });
    });

    test('works with Window other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('[data-toggle="data"]')
                    .cloneData(window);
            return $.getData(window);
        })).toEqual({
            test1: 'Test 1',
            test2: 'Test 2',
        });
    });

    test('works with array other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.cloneData(
                '[data-toggle="data"]',
                [
                    document.getElementById('test3'),
                    document.getElementById('test4'),
                ],
            );
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

    test('works with QuerySet other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('[data-toggle="noData"]');
            $('[data-toggle="data"]')
                    .cloneData(query);
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
