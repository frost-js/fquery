import { expect, test } from '#test';

test.describe('#sanitize', () => {
    test('returns a sanitized HTML string', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.sanitize(
                '<script>' +
                    'window.alert(123);' +
                    '</script>' +
                    '<div class="div">' +
                    '<a href="#" title="Test 1" target="_blank" rel="nofollow" onclick="window.alert(123)">Test</a>' +
                    '</div>',
            ))).toBe('<div class="div">' +
            '<a href="#" title="Test 1" target="_blank" rel="nofollow">Test</a>' +
            '</div>');
    });

    test.describe('URL validation', () => {
        test('removes javascript URLs', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize(
                    '<a href="javascript:alert(1)">Test 1</a>' +
                    '<a href="java&#10;script:alert(1)">Test 2</a>' +
                    '<img src="JAVASCRIPT:alert(1)">',
                ))).toBe(
                '<a>Test 1</a>' +
                '<a>Test 2</a>' +
                '<img>',
            );
        });

        test('validates URL attributes allowed by regular expression rules', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize(
                    '<a href="javascript:alert(1)">Test</a>',
                    {
                        a: [/^href$/],
                    },
                ))).toBe('<a>Test</a>');
        });

        test('validates form action URLs', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize(
                    '<form action="javascript:alert(1)">' +
                        '<button formaction="javascript:alert(1)">Test</button>' +
                    '</form>',
                    {
                        button: ['formaction'],
                        form: ['action'],
                    },
                ))).toBe('<form><button>Test</button></form>');
        });

        test('allows non-javascript URLs', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize(
                    '<a href="/test">Test 1</a>' +
                    '<a href="mailto:test@example.com">Test 2</a>' +
                    '<img src="data:image/png;base64,Test">',
                ))).toBe(
                '<a href="/test">Test 1</a>' +
                '<a href="mailto:test@example.com">Test 2</a>' +
                '<img src="data:image/png;base64,Test">',
            );
        });

        test('removes malformed URLs', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize('<a href="http://[">Test</a>')))
                .toBe('<a>Test</a>');
        });
    });

    test.describe('allowed tags and attributes', () => {
        test('sanitizes a HTML string with allowed tags', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize(
                    '<div id="div" class="test">' +
                        '<span id="span" class="test">Test</span>' +
                        '<a href="#" title="Test 1">Test</a>' +
                        '</div>',
                    {
                        div: [],
                    },
                ))).toBe('<div></div>');
        });

        test('sanitizes a HTML string with allowed attributes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize(
                    '<div id="div" class="test">' +
                        '<span id="span" class="test">Test</span>' +
                        '<a href="#" title="Test 1">Test</a>' +
                        '</div>',
                    {
                        div: ['class', 'id'],
                        span: [],
                    },
                ))).toBe('<div id="div" class="test">' +
                '<span>Test</span>' +
                '</div>');
        });

        test('matches string attribute rules exactly', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize(
                    '<div id="test" data-id="test" aria-labelledby="test">Test</div>',
                    {
                        div: ['id'],
                    },
                ))).toBe('<div id="test">Test</div>');
        });

        test('supports regular expression attribute rules', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize(
                    '<div data-test="Test" title="Test">Test</div>',
                    {
                        div: [/^data-[\w-]+$/],
                    },
                ))).toBe('<div data-test="Test">Test</div>');
        });

        test('ignores inherited tag rules', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize('<constructor>Test</constructor>', {}))).toBe('');
        });

        test('sanitizes a HTML string with allowed wildcard attributes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize(
                    '<div id="div" class="test">' +
                        '<span id="span" class="test">Test</span>' +
                        '<a href="#" title="Test 1">Test</a>' +
                        '</div>',
                    {
                        '*': ['class', 'id'],
                        'div': [],
                        'span': [],
                    },
                ))).toBe('<div id="div" class="test">' +
                '<span id="span" class="test">Test</span>' +
                '</div>');
        });
    });

    test.describe('shadowed DOM properties', () => {
        test('allows forms with a control named tagName', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize(
                    '<form><input name="tagName"></form>',
                    {
                        form: [],
                        input: ['name'],
                    },
                ))).toBe('<form><input name="tagName"></form>');
        });

        test('removes disallowed form attributes when a control shadows attributes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize(
                    '<form onclick="window.alert(1)">' +
                        '<input name="attributes">' +
                        '</form>',
                    {
                        form: [],
                        input: ['name'],
                    },
                ))).toBe('<form><input name="attributes"></form>');
        });

        test('removes disallowed form attributes when a control shadows removeAttribute', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize(
                    '<form onclick="window.alert(1)">' +
                        '<input name="removeAttribute">' +
                        '</form>',
                    {
                        form: [],
                        input: ['name'],
                    },
                ))).toBe('<form><input name="removeAttribute"></form>');
        });

        test('removes disallowed form descendants when a control shadows children', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize(
                    '<form>' +
                        '<input name="children"><script>window.alert(1)</script>' +
                        '</form>',
                    {
                        form: [],
                        input: ['name'],
                    },
                ))).toBe('<form><input name="children"></form>');
        });

        test('removes disallowed forms with a control named remove', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.sanitize('<form><input name="remove"></form>', {}))).toBe('');
        });
    });

    test.describe('template contents', () => {
        for (const [name, html, allowedTags, expected] of [
            [
                'removes disallowed elements from template contents',
                '<template id="template"><script>window.alert(123);</script></template>',
                { template: ['id'] },
                '<template id="template"></template>',
            ],
            [
                'removes disallowed attributes from template contents',
                '<template id="template"><a href="#" onclick="window.alert(123)">Test</a></template>',
                { a: ['href'], template: ['id'] },
                '<template id="template"><a href="#">Test</a></template>',
            ],
            [
                'removes javascript URLs from template contents',
                '<template id="template"><a href="javascript:alert(1)">Test</a></template>',
                { a: ['href'], template: ['id'] },
                '<template id="template"><a>Test</a></template>',
            ],
            [
                'removes disallowed elements from nested template contents',
                '<template id="template"><template><script>window.alert(123);</script></template></template>',
                { template: ['id'] },
                '<template id="template"><template></template></template>',
            ],
            [
                'removes disallowed attributes from nested template contents',
                '<template id="template"><template onclick="window.alert(123)"><a href="#" onclick="window.alert(123)">Test</a></template></template>',
                { a: ['href'], template: ['id'] },
                '<template id="template"><template><a href="#">Test</a></template></template>',
            ],
            [
                'removes javascript URLs from nested template contents',
                '<template id="template"><template><a href="javascript:alert(1)">Test</a></template></template>',
                { a: ['href'], template: ['id'] },
                '<template id="template"><template><a>Test</a></template></template>',
            ],
        ]) {
            test(name, async ({ page }) => {
                const sanitized = await page.evaluate(([html, allowedTags]) =>
                    $.sanitize(html, allowedTags), [html, allowedTags]);

                expect(sanitized).toBe(expected);
            });
        }
    });
});
