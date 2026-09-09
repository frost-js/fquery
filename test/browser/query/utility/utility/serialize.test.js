import { serializeTests, setup } from '#cases/utility/utility/serialize.js';
import { expect, test } from '#test';

test.describe('QuerySet #serialize', () => {
    test.beforeEach(setup);

    serializeTests((nodes) => $(nodes).serialize());

    test('normalizes lone carriage returns in control values', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const input = document.getElementById('test1');
            input.type = 'hidden';
            input.value = 'A\rB';
            return $(input).serialize();
        })).toBe('test1=A%0D%0AB');
    });

    test('preserves CRLF pairs in control values', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const input = document.getElementById('test1');
            input.type = 'hidden';
            input.value = 'A\r\nB';
            return $(input).serialize();
        })).toBe('test1=A%0D%0AB');
    });

    test('serializes form nodes with an associated control whose id is nodeType', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form"><input name="test1" type="text" value="Test 1"></form>' +
                '<input name="test2" type="text" id="nodeType" value="Test 2" form="form">';
            return $(document.getElementById('form')).serialize();
        })).toBe('test1=Test%201&test2=Test%202');
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                document.body.innerHTML,
            );
            return $(fragment)
                    .serialize();
        })).toBe('test1=Test%201&test2=2&test3=Test%203&test4=42&test5%5B%5D=51&test5%5B%5D=52&test6=Test%206&test8=Test%208b&test9%5B%5D=Test%209a&test9%5B%5D=Test%209b');
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
                    .serialize();
        })).toBe('test1=Test%201&test2=2&test3=Test%203&test4=42&test5%5B%5D=51&test5%5B%5D=52&test6=Test%206&test8=Test%208b&test9%5B%5D=Test%209a&test9%5B%5D=Test%209b');
    });
});
