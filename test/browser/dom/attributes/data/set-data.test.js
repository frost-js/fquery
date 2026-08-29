import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#setData', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1"></div>' +
                '<div id="test2"></div>';
        });
    });

    test('sets a data object for all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData('div', {
                testA: 'Test 1',
                testB: 'Test 2',
            });
            return [
                $.getData('#test1'),
                $.getData('#test2'),
            ];
        })).toEqual([
            {
                testA: 'Test 1',
                testB: 'Test 2',
            },
            {
                testA: 'Test 1',
                testB: 'Test 2',
            },
        ]);
    });

    test('sets data for all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData('div', 'test', 'Test 1');
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

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(
                document.getElementById('test1'),
                'test',
                'Test 1',
            );
            return $.getData('#test1');
        })).toEqual({
            test: 'Test 1',
        });
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(
                document.querySelectorAll('div'),
                'test',
                'Test 1',
            );
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
        expect(await page.evaluate((_) => {
            $.setData(
                document.body.children,
                'test',
                'Test 1',
            );
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
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            $.setData(fragment, 'test', 'Test 1');
            return $.getData(fragment);
        })).toEqual({
            test: 'Test 1',
        });
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.setData(shadow, 'test', 'Test 1');
            return $.getData(shadow);
        })).toEqual({
            test: 'Test 1',
        });
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(document, 'test', 'Test 1');
            return $.getData(document);
        })).toEqual({
            test: 'Test 1',
        });
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(window, 'test', 'Test 1');
            return $.getData(window);
        })).toEqual({
            test: 'Test 1',
        });
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
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
