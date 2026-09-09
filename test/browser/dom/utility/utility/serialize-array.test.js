import { serializeArrayTests, setup } from '#cases/utility/utility/serialize-array.js';
import { expect, test } from '#test';

test.describe('#serializeArray', () => {
    test.beforeEach(setup);

    serializeArrayTests((nodes) => $.serializeArray(nodes));

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.serializeArray(
                    document.getElementById('form'),
                ))).toEqual([
                {
                    name: 'test1',
                    value: 'Test 1',
                },
                {
                    name: 'test2',
                    value: '2',
                },
                {
                    name: 'test3',
                    value: 'Test 3',
                },
                {
                    name: 'test4',
                    value: '42',
                },
                {
                    name: 'test5[]',
                    value: '51',
                },
                {
                    name: 'test5[]',
                    value: '52',
                },
                {
                    name: 'test6',
                    value: 'Test 6',
                },
                {
                    name: 'test8',
                    value: 'Test 8b',
                },
                {
                    name: 'test9[]',
                    value: 'Test 9a',
                },
                {
                    name: 'test9[]',
                    value: 'Test 9b',
                },
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.serializeArray(
                    document.querySelectorAll('input, textarea, select'),
                ))).toEqual([
                {
                    name: 'test1',
                    value: 'Test 1',
                },
                {
                    name: 'test2',
                    value: '2',
                },
                {
                    name: 'test3',
                    value: 'Test 3',
                },
                {
                    name: 'test4',
                    value: '42',
                },
                {
                    name: 'test5[]',
                    value: '51',
                },
                {
                    name: 'test5[]',
                    value: '52',
                },
                {
                    name: 'test6',
                    value: 'Test 6',
                },
                {
                    name: 'test8',
                    value: 'Test 8b',
                },
                {
                    name: 'test9[]',
                    value: 'Test 9a',
                },
                {
                    name: 'test9[]',
                    value: 'Test 9b',
                },
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.serializeArray(
                    document.body.children,
                ))).toEqual([
                {
                    name: 'test1',
                    value: 'Test 1',
                },
                {
                    name: 'test2',
                    value: '2',
                },
                {
                    name: 'test3',
                    value: 'Test 3',
                },
                {
                    name: 'test4',
                    value: '42',
                },
                {
                    name: 'test5[]',
                    value: '51',
                },
                {
                    name: 'test5[]',
                    value: '52',
                },
                {
                    name: 'test6',
                    value: 'Test 6',
                },
                {
                    name: 'test8',
                    value: 'Test 8b',
                },
                {
                    name: 'test9[]',
                    value: 'Test 9a',
                },
                {
                    name: 'test9[]',
                    value: 'Test 9b',
                },
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    document.body.innerHTML,
                );
                return $.serializeArray(fragment);
            })).toEqual([
                {
                    name: 'test1',
                    value: 'Test 1',
                },
                {
                    name: 'test2',
                    value: '2',
                },
                {
                    name: 'test3',
                    value: 'Test 3',
                },
                {
                    name: 'test4',
                    value: '42',
                },
                {
                    name: 'test5[]',
                    value: '51',
                },
                {
                    name: 'test5[]',
                    value: '52',
                },
                {
                    name: 'test6',
                    value: 'Test 6',
                },
                {
                    name: 'test8',
                    value: 'Test 8b',
                },
                {
                    name: 'test9[]',
                    value: 'Test 9a',
                },
                {
                    name: 'test9[]',
                    value: 'Test 9b',
                },
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    document.body.innerHTML,
                );
                shadow.appendChild(fragment);
                return $.serializeArray(shadow);
            })).toEqual([
                {
                    name: 'test1',
                    value: 'Test 1',
                },
                {
                    name: 'test2',
                    value: '2',
                },
                {
                    name: 'test3',
                    value: 'Test 3',
                },
                {
                    name: 'test4',
                    value: '42',
                },
                {
                    name: 'test5[]',
                    value: '51',
                },
                {
                    name: 'test5[]',
                    value: '52',
                },
                {
                    name: 'test6',
                    value: 'Test 6',
                },
                {
                    name: 'test8',
                    value: 'Test 8b',
                },
                {
                    name: 'test9[]',
                    value: 'Test 9a',
                },
                {
                    name: 'test9[]',
                    value: 'Test 9b',
                },
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.serializeArray([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                    document.getElementById('test3'),
                    document.getElementById('test4'),
                    document.getElementById('test5'),
                    document.getElementById('test6'),
                    document.getElementById('test7'),
                    document.getElementById('test8a'),
                    document.getElementById('test8b'),
                    document.getElementById('test9a'),
                    document.getElementById('test9b'),
                ]))).toEqual([
                {
                    name: 'test1',
                    value: 'Test 1',
                },
                {
                    name: 'test2',
                    value: '2',
                },
                {
                    name: 'test3',
                    value: 'Test 3',
                },
                {
                    name: 'test4',
                    value: '42',
                },
                {
                    name: 'test5[]',
                    value: '51',
                },
                {
                    name: 'test5[]',
                    value: '52',
                },
                {
                    name: 'test6',
                    value: 'Test 6',
                },
                {
                    name: 'test8',
                    value: 'Test 8b',
                },
                {
                    name: 'test9[]',
                    value: 'Test 9a',
                },
                {
                    name: 'test9[]',
                    value: 'Test 9b',
                },
            ]);
        });
    });
});
