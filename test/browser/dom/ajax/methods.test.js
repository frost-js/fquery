import { expect, test } from '#test';

for (const [method, httpMethod] of [
    ['get', 'GET'],
    ['post', 'POST'],
    ['put', 'PUT'],
    ['patch', 'PATCH'],
    ['delete', 'DELETE'],
]) {
    test.describe(`#${method}`, () => {
        test('uses its HTTP method despite a different global default', async ({ page }) => {
            expect(await page.evaluate(async (method) => {
                $.setAjaxDefaults({
                    method: method === 'get' ? 'POST' : 'GET',
                });

                const response = await $[method]();
                return response.xhr.data.method;
            }, method)).toBe(httpMethod);
        });

        test('forwards the URL', async ({ page }) => {
            expect(await page.evaluate(async (method) => {
                const response = await $[method]('/test');
                return response.xhr.data.url;
            }, method)).toBe('/test');
        });

        test('forwards the data', async ({ page }) => {
            expect(await page.evaluate(async (method) => {
                const data = 'test=Test';
                const response = await $[method]('/test', method === 'delete' ? { data } : data);
                return method === 'get' ? response.xhr.data.url : response.xhr.data.body;
            }, method)).toBe(method === 'get' ? 'http://localhost:3001/test?test=Test' : 'test=Test');
        });

        test('forwards options that override a default header', async ({ page }) => {
            expect(await page.evaluate(async (method) => {
                $.setAjaxDefaults({
                    headers: {
                        'X-Test': 'Test 1',
                    },
                });

                const options = {
                    headers: {
                        'x-test': 'Test 2',
                    },
                };
                const args = method === 'delete' ? [null, options] : [null, null, options];
                const response = await $[method](...args);
                return response.xhr.data.headers;
            }, method)).toEqual({
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-test': 'Test 2',
                'X-Requested-With': 'XMLHttpRequest',
            });
        });

        test('allows options to override the HTTP method', async ({ page }) => {
            expect(await page.evaluate(async (method) => {
                const options = {
                    method: 'HEAD',
                };
                const args = method === 'delete' ? [null, options] : [null, null, options];
                const response = await $[method](...args);
                return response.xhr.data.method;
            }, method)).toBe('HEAD');
        });

        test('returns a cancellable request', async ({ page }) => {
            expect(await page.evaluate(async (method) => {
                try {
                    const request = $[method]();
                    request.cancel();
                    await request;
                    return false;
                } catch (error) {
                    return error.reason;
                }
            }, method)).toBe('Request was cancelled');
        });
    });
}
