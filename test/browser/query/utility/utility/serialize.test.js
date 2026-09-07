import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #serialize', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<div>' +
                '<input name="test1" type="text" id="test1" value="Test 1">' +
                '</div>' +
                '<div>' +
                '<input name="test2" type="number" id="test2" value="2">' +
                '</div>' +
                '<div>' +
                '<textarea name="test3" id="test3">Test 3</textarea>' +
                '</div>' +
                '<div>' +
                '<select name="test4" id="test4"><option value="41">1</option><option value="42" selected>2</option></select>' +
                '</div>' +
                '<div>' +
                '<select name="test5[]" id="test5" multiple="true"><option value="51" selected>1</option><option value="52" selected>2</option></select>' +
                '</div>' +
                '<div>' +
                '<input name="test6" type="checkbox" id="test6" value="Test 6" checked>' +
                '</div>' +
                '<div>' +
                '<input name="test7" type="checkbox" id="test7" value="Test 7">' +
                '</div>' +
                '<div>' +
                '<input name="test8" type="radio" id="test8a" value="Test 8a">' +
                '<input name="test8" type="radio" id="test8b" value="Test 8b" checked>' +
                '</div>' +
                '<div>' +
                '<input name="test9[]" type="text" id="test9a" value="Test 9a">' +
                '<input name="test9[]" type="text" id="test9b" value="Test 9b">' +
                '</div>' +
                '</form>';
        });
    });

    test('returns a serialized string of all form elements', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('form')
                    .serialize())).toBe('test1=Test%201&test2=2&test3=Test%203&test4=42&test5%5B%5D=51&test5%5B%5D=52&test6=Test%206&test8=Test%208b&test9%5B%5D=Test%209a&test9%5B%5D=Test%209b');
    });

    test('excludes controls in disabled fieldsets', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<fieldset disabled>' +
                '<input name="test1" type="text" value="Test 1">' +
                '<select name="test2"><option value="Test 2" selected>Test 2</option></select>' +
                '<textarea name="test3">Test 3</textarea>' +
                '</fieldset>' +
                '<input name="test4" type="text" value="Test 4">' +
                '</form>';
            return $('#form')
                    .serialize();
        })).toBe('test4=Test%204');
    });

    test('includes enabled controls in the first legend of a disabled fieldset', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<fieldset disabled>' +
                '<legend>' +
                '<input name="test1" type="text" value="Test 1">' +
                '<input name="test2" type="text" value="Test 2" disabled>' +
                '</legend>' +
                '<legend><input name="test3" type="text" value="Test 3"></legend>' +
                '<input name="test4" type="text" value="Test 4">' +
                '</fieldset>' +
                '</form>';
            return $('#form')
                    .serialize();
        })).toBe('test1=Test%201');
    });

    test('excludes disabled selected options', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<select name="test1">' +
                '<option value="Test 1" selected disabled>Test 1</option>' +
                '<option value="Other">Other</option>' +
                '</select>' +
                '<select name="test2[]" multiple>' +
                '<option value="Test 2a" selected>Test 2a</option>' +
                '<option value="Test 2b" selected disabled>Test 2b</option>' +
                '<option value="Test 2c" selected>Test 2c</option>' +
                '<option value="Other">Other</option>' +
                '</select>' +
                '<select name="test3"><option value="" selected>Test 3</option></select>' +
                '</form>';
            return $('#form').serialize();
        })).toBe('test2%5B%5D=Test%202a&test2%5B%5D=Test%202c&test3=');
    });

    test('excludes selected options in disabled optgroups', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<select name="test1">' +
                '<optgroup label="Disabled" disabled>' +
                '<option value="Test 1" selected>Test 1</option>' +
                '</optgroup>' +
                '<option value="Other">Other</option>' +
                '</select>' +
                '<select name="test2[]" multiple>' +
                '<option value="Test 2a" selected>Test 2a</option>' +
                '<optgroup label="Disabled" disabled>' +
                '<option value="Test 2b" selected>Test 2b</option>' +
                '</optgroup>' +
                '<optgroup label="Enabled">' +
                '<option value="Test 2c" selected>Test 2c</option>' +
                '</optgroup>' +
                '</select>' +
                '</form>';
            return $('#form').serialize();
        })).toBe('test2%5B%5D=Test%202a&test2%5B%5D=Test%202c');
    });

    test('serializes associated controls in document order', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<input name="test1" type="text" value="Test 1" form="form">' +
                '<form id="form">' +
                '<fieldset name="fieldset">' +
                '<input name="test2" type="text" value="Test 2">' +
                '</fieldset>' +
                '<input name="other" type="text" value="Other" form="other">' +
                '<button name="button" value="Button">Button</button>' +
                '<output name="output">Output</output>' +
                '</form>' +
                '<select name="test3" form="form"><option value="Test 3" selected>Test 3</option></select>' +
                '<textarea name="test4" form="form">Test 4</textarea>' +
                '<input name="unrelated" type="text" value="Unrelated">' +
                '<form id="other"></form>';
            return $('#form')
                    .serialize();
        })).toBe('test1=Test%201&test2=Test%202&test3=Test%203&test4=Test%204');
    });

    test('serializes forms with a control named elements', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<input name="elements" type="text" value="Test 1">' +
                '<input name="test2" type="text" value="Test 2">' +
                '</form>' +
                '<input name="test3" type="text" value="Test 3" form="form">';
            return $('#form').serialize();
        })).toBe('elements=Test%201&test2=Test%202&test3=Test%203');
    });

    test('serializes forms with a control whose id is elements', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<input name="test1" type="text" id="elements" value="Test 1">' +
                '<input name="test2" type="text" value="Test 2">' +
                '</form>' +
                '<input name="test3" type="text" value="Test 3" form="form">';
            return $('#form').serialize();
        })).toBe('test1=Test%201&test2=Test%202&test3=Test%203');
    });

    test('serializes forms with a control named matches', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<input name="matches" type="text" value="Test 1">' +
                '<input name="test2" type="text" value="Test 2">' +
                '</form>' +
                '<input name="test3" type="text" value="Test 3" form="form">';
            return $('#form').serialize();
        })).toBe('matches=Test%201&test2=Test%202&test3=Test%203');
    });

    test('serializes forms with a control whose id is matches', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<input name="test1" type="text" id="matches" value="Test 1">' +
                '<input name="test2" type="text" value="Test 2">' +
                '</form>' +
                '<input name="test3" type="text" value="Test 3" form="form">';
            return $('#form').serialize();
        })).toBe('test1=Test%201&test2=Test%202&test3=Test%203');
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
