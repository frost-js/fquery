import { expect, test } from '#test';

test.describe('#setAjaxDefaults', () => {
    test('overrides a default header with different casing', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setAjaxDefaults({
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            $.setAjaxDefaults({
                headers: {
                    'content-type': 'application/json',
                },
            });
            return $.getAjaxDefaults().headers;
        })).toEqual({
            'content-type': 'application/json',
        });
    });

    test('overrides a default header when changing back to its original casing', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setAjaxDefaults({
                headers: {
                    'X-Test': 'Test 1',
                },
            });
            $.setAjaxDefaults({
                headers: {
                    'x-test': 'Test 2',
                },
            });
            $.setAjaxDefaults({
                headers: {
                    'X-Test': 'Test 3',
                },
            });
            return $.getAjaxDefaults().headers;
        })).toEqual({
            'X-Test': 'Test 3',
        });
    });

    test('preserves other default headers when updating a header', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setAjaxDefaults({
                headers: {
                    'X-Default': 'Test 1',
                    'X-Test': 'Test 2',
                },
            });
            $.setAjaxDefaults({
                headers: {
                    'x-test': 'Test 3',
                },
            });
            return $.getAjaxDefaults().headers;
        })).toEqual({
            'X-Default': 'Test 1',
            'x-test': 'Test 3',
        });
    });

    test('preserves default headers when setting other options', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setAjaxDefaults({
                headers: {
                    'X-Test': 'Test 1',
                },
            });
            $.setAjaxDefaults({
                timeout: 1000,
            });
            return $.getAjaxDefaults().headers;
        })).toEqual({
            'X-Test': 'Test 1',
        });
    });

    test('preserves default headers when a request overrides them', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            $.setAjaxDefaults({
                headers: {
                    'X-Test': 'Test 1',
                },
            });
            await $.ajax({
                headers: {
                    'x-test': 'Test 2',
                },
            });
            return $.getAjaxDefaults().headers;
        })).toEqual({
            'X-Test': 'Test 1',
        });
    });
});
