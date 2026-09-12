import { expect, test } from '#test';

test.describe('QuerySet #setData', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1"></div>' +
                '<div id="test2"></div>';
        });
    });

    test('sets a data object for all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('div')
                    .setData({
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
            $('div').setData('test', 'Test 1');
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

    test('stores __proto__ as a data key for all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('div').setData('__proto__', 'Test 1');
            return [
                $.getData('#test1', '__proto__'),
                $.getData('#test2', '__proto__'),
            ];
        })).toEqual([
            'Test 1',
            'Test 1',
        ]);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.setData('test', 'Test 1');
        })).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            $(fragment).setData('test', 'Test 1');
            return $.getData(fragment);
        })).toEqual({
            test: 'Test 1',
        });
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $(shadow).setData('test', 'Test 1');
            return $.getData(shadow);
        })).toEqual({
            test: 'Test 1',
        });
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $(document).setData('test', 'Test 1');
            return $.getData(document);
        })).toEqual({
            test: 'Test 1',
        });
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $(window).setData('test', 'Test 1');
            return $.getData(window);
        })).toEqual({
            test: 'Test 1',
        });
    });
});
