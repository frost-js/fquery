import { expect, test } from '#test';

test.describe('QuerySet #serializeArray', () => {
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
                    .serializeArray())).toEqual([
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

    test('excludes button inputs', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<input name="test1" type="button" value="Test 1">' +
                '<input name="test2" type="text" value="Test 2">' +
                '</form>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test2',
                value: 'Test 2',
            },
        ]);
    });

    test('excludes directly selected image inputs', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<input name="test1" type="image" value="Test 1">' +
                '<input name="test2" type="text" value="Test 2">';
            return $('input').serializeArray();
        })).toEqual([
            {
                name: 'test2',
                value: 'Test 2',
            },
        ]);
    });

    test('excludes button elements', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<button name="button" value="Button">Button</button>' +
                '<input name="test1" type="text" value="Test 1">' +
                '</form>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test1',
                value: 'Test 1',
            },
        ]);
    });

    test('excludes directly selected button elements', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<button name="test1" value="Test 1">Test 1</button>' +
                '<input name="test2" type="text" value="Test 2">';
            return $('button, input').serializeArray();
        })).toEqual([
            {
                name: 'test2',
                value: 'Test 2',
            },
        ]);
    });

    test('excludes output elements', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<output name="output">Output</output>' +
                '<input name="test1" type="text" value="Test 1">' +
                '</form>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test1',
                value: 'Test 1',
            },
        ]);
    });

    test('excludes directly selected output elements', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<output name="test1">Test 1</output>' +
                '<input name="test2" type="text" value="Test 2">';
            return $('output, input').serializeArray();
        })).toEqual([
            {
                name: 'test2',
                value: 'Test 2',
            },
        ]);
    });

    for (const [control, html] of [
        ['inputs', '<input name="test1" type="text" value="Test 1">'],
        ['nested inputs', '<span><input name="test1" type="text" value="Test 1"></span>'],
        ['selects', '<select name="test1"><option value="Test 1" selected>Test 1</option></select>'],
        ['textareas', '<textarea name="test1">Test 1</textarea>'],
    ]) {
        test(`excludes ${control} inside datalists`, async ({ page }) => {
            expect(await page.evaluate((html) => {
                document.body.innerHTML =
                    '<form id="form">' +
                    '<datalist>' +
                    html +
                    '</datalist>' +
                    '<input name="test2" type="text" value="Test 2">' +
                    '</form>';
                return $('#form').serializeArray();
            }, html)).toEqual([
                {
                    name: 'test2',
                    value: 'Test 2',
                },
            ]);
        });
    }

    test('includes inputs associated with datalists', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<datalist id="list"><option value="Test 1"></option></datalist>' +
                '<input name="test1" type="text" value="Test 1" list="list">' +
                '</form>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test1',
                value: 'Test 1',
            },
        ]);
    });

    test('excludes named fieldsets while including their controls', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<fieldset name="fieldset">' +
                '<input name="test1" type="text" value="Test 1">' +
                '</fieldset>' +
                '</form>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test1',
                value: 'Test 1',
            },
        ]);
    });

    for (const [control, html] of [
        ['inputs', '<input name="test1" type="text" value="Test 1">'],
        ['selects', '<select name="test1"><option value="Test 1" selected>Test 1</option></select>'],
        ['textareas', '<textarea name="test1">Test 1</textarea>'],
    ]) {
        test(`excludes ${control} in disabled fieldsets`, async ({ page }) => {
            expect(await page.evaluate((html) => {
                document.body.innerHTML =
                    '<form id="form">' +
                    '<fieldset disabled>' +
                    html +
                    '</fieldset>' +
                    '<input name="test2" type="text" value="Test 2">' +
                    '</form>';
                return $('#form').serializeArray();
            }, html)).toEqual([
                {
                    name: 'test2',
                    value: 'Test 2',
                },
            ]);
        });
    }

    test('includes enabled controls in the first legend of a disabled fieldset', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<fieldset disabled>' +
                '<legend><input name="test1" type="text" value="Test 1"></legend>' +
                '</fieldset>' +
                '</form>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test1',
                value: 'Test 1',
            },
        ]);
    });

    test('excludes disabled controls in the first legend of a disabled fieldset', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<fieldset disabled>' +
                '<legend><input name="test1" type="text" value="Test 1" disabled></legend>' +
                '</fieldset>' +
                '<input name="test2" type="text" value="Test 2">' +
                '</form>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test2',
                value: 'Test 2',
            },
        ]);
    });

    test('excludes controls in later legends of a disabled fieldset', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<fieldset disabled>' +
                '<legend>Test</legend>' +
                '<legend><input name="test1" type="text" value="Test 1"></legend>' +
                '</fieldset>' +
                '<input name="test2" type="text" value="Test 2">' +
                '</form>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test2',
                value: 'Test 2',
            },
        ]);
    });

    test('excludes disabled selected options from single selects', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<select name="test1">' +
                '<option value="Test 1" selected disabled>Test 1</option>' +
                '<option value="Other">Other</option>' +
                '</select>' +
                '<input name="test2" type="text" value="Test 2">' +
                '</form>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test2',
                value: 'Test 2',
            },
        ]);
    });

    test('excludes disabled selected options from multiple selects', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<select name="test1[]" multiple>' +
                '<option value="Test 1a" selected>Test 1a</option>' +
                '<option value="Test 1b" selected disabled>Test 1b</option>' +
                '<option value="Test 1c" selected>Test 1c</option>' +
                '<option value="Other">Other</option>' +
                '</select>' +
                '</form>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test1[]',
                value: 'Test 1a',
            },
            {
                name: 'test1[]',
                value: 'Test 1c',
            },
        ]);
    });

    test('includes selected options with empty values', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<select name="test1"><option value="" selected>Test 1</option></select>' +
                '</form>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test1',
                value: '',
            },
        ]);
    });

    test('excludes selected options in disabled optgroups from single selects', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<select name="test1">' +
                '<optgroup label="Disabled" disabled>' +
                '<option value="Test 1" selected>Test 1</option>' +
                '</optgroup>' +
                '<option value="Other">Other</option>' +
                '</select>' +
                '<input name="test2" type="text" value="Test 2">' +
                '</form>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test2',
                value: 'Test 2',
            },
        ]);
    });

    test('excludes selected options in disabled optgroups from multiple selects', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<select name="test1[]" multiple>' +
                '<option value="Test 1a" selected>Test 1a</option>' +
                '<optgroup label="Disabled" disabled>' +
                '<option value="Test 1b" selected>Test 1b</option>' +
                '</optgroup>' +
                '<optgroup label="Enabled">' +
                '<option value="Test 1c" selected>Test 1c</option>' +
                '</optgroup>' +
                '</select>' +
                '</form>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test1[]',
                value: 'Test 1a',
            },
            {
                name: 'test1[]',
                value: 'Test 1c',
            },
        ]);
    });

    test('serializes associated controls in document order', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<input name="test1" type="text" value="Test 1" form="form">' +
                '<form id="form">' +
                '<input name="test2" type="text" value="Test 2">' +
                '</form>' +
                '<select name="test3" form="form"><option value="Test 3" selected>Test 3</option></select>' +
                '<textarea name="test4" form="form">Test 4</textarea>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test1',
                value: 'Test 1',
            },
            {
                name: 'test2',
                value: 'Test 2',
            },
            {
                name: 'test3',
                value: 'Test 3',
            },
            {
                name: 'test4',
                value: 'Test 4',
            },
        ]);
    });

    test('excludes descendant controls associated with another form', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form id="form">' +
                '<input name="test1" type="text" value="Test 1" form="other">' +
                '<input name="test2" type="text" value="Test 2">' +
                '</form>' +
                '<form id="other"></form>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test2',
                value: 'Test 2',
            },
        ]);
    });

    test('excludes controls outside the form without an association', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<input name="test1" type="text" value="Test 1">' +
                '<form id="form">' +
                '<input name="test2" type="text" value="Test 2">' +
                '</form>';
            return $('#form').serializeArray();
        })).toEqual([
            {
                name: 'test2',
                value: 'Test 2',
            },
        ]);
    });

    for (const key of ['elements', 'matches']) {
        test(`serializes forms with a control named ${key}`, async ({ page }) => {
            expect(await page.evaluate((key) => {
                document.body.innerHTML =
                    '<form id="form">' +
                    '<input name="' + key + '" type="text" value="Test 1">' +
                    '<input name="test2" type="text" value="Test 2">' +
                    '</form>' +
                    '<input name="test3" type="text" value="Test 3" form="form">';
                return $('#form').serializeArray();
            }, key)).toEqual([
                {
                    name: key,
                    value: 'Test 1',
                },
                {
                    name: 'test2',
                    value: 'Test 2',
                },
                {
                    name: 'test3',
                    value: 'Test 3',
                },
            ]);
        });

        test(`serializes forms with a control whose id is ${key}`, async ({ page }) => {
            expect(await page.evaluate((key) => {
                document.body.innerHTML =
                    '<form id="form">' +
                    '<input name="test1" type="text" id="' + key + '" value="Test 1">' +
                    '<input name="test2" type="text" value="Test 2">' +
                    '</form>' +
                    '<input name="test3" type="text" value="Test 3" form="form">';
                return $('#form').serializeArray();
            }, key)).toEqual([
                {
                    name: 'test1',
                    value: 'Test 1',
                },
                {
                    name: 'test2',
                    value: 'Test 2',
                },
                {
                    name: 'test3',
                    value: 'Test 3',
                },
            ]);
        });
    }

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
