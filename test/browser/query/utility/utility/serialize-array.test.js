import { serializeArrayTests, setup } from '#cases/utility/utility/serialize-array.js';
import { expect, test } from '#test';

test.describe('QuerySet #serializeArray', () => {
    test.beforeEach(setup);

    serializeArrayTests((nodes) => $(nodes).serializeArray());

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                document.body.innerHTML,
            );
            return $(fragment)
                    .serializeArray();
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
            return $(shadow)
                    .serializeArray();
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
});
