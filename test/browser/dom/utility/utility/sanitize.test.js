import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

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
            $.sanitize(
                '<constructor>Test</constructor>',
                {},
            ))).toBe('');
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
