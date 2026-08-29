import { expect, test } from '#test';
import { resetPage } from '../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#get', () => {
    test('performs an AJAX GET request', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get();
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX GET request with URL', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get('/test');
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 200,
                url: '/test',
            },
        });
    });

    test('performs an AJAX GET request with data (object)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, {
                test1: 'Test 1',
                test2: 'Test 2',
            });
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 200,
                url: 'http://localhost:3001/?test1=Test+1&test2=Test+2',
            },
        });
    });

    test('performs an AJAX GET request with data (deep object)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, {
                test1: 'Test 1',
                test2: {
                    a: '1',
                    b: '2',
                },
            });
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 200,
                url: 'http://localhost:3001/?test1=Test+1&test2%5Ba%5D=1&test2%5Bb%5D=2',
            },
        });
    });

    test('performs an AJAX GET request with data (implicit deep object)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, {
                'test1': 'Test 1',
                'test2[a]': '1',
                'test2[b]': '2',
            });
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 200,
                url: 'http://localhost:3001/?test1=Test+1&test2%5Ba%5D=1&test2%5Bb%5D=2',
            },
        });
    });

    test('performs an AJAX GET request with data (object with array)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, {
                test1: 'Test 1',
                test2: ['1', '2'],
            });
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 200,
                url: 'http://localhost:3001/?test1=Test+1&test2%5B%5D=1&test2%5B%5D=2',
            },
        });
    });

    test('performs an AJAX GET request with data (object with implicit array)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, {
                'test1': 'Test 1',
                'test2[]': ['1', '2'],
            });
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 200,
                url: 'http://localhost:3001/?test1=Test+1&test2%5B%5D=1&test2%5B%5D=2',
            },
        });
    });

    test('performs an AJAX GET request with data (array)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, [
                {
                    name: 'test1',
                    value: 'Test 1',
                },
                {
                    name: 'test2',
                    value: 'Test 2',
                },
            ]);
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 200,
                url: 'http://localhost:3001/?test1=Test+1&test2=Test+2',
            },
        });
    });

    test('performs an AJAX GET request with data (deep array)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, [
                {
                    name: 'test1',
                    value: 'Test 1',
                },
                {
                    name: 'test2',
                    value: ['1', '2'],
                },
            ]);
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 200,
                url: 'http://localhost:3001/?test1=Test+1&test2%5B%5D=1&test2%5B%5D=2',
            },
        });
    });

    test('performs an AJAX GET request with data (implicit deep array)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, [
                {
                    name: 'test1',
                    value: 'Test 1',
                },
                {
                    name: 'test2[]',
                    value: ['1', '2'],
                },
            ]);
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 200,
                url: 'http://localhost:3001/?test1=Test+1&test2%5B%5D=1&test2%5B%5D=2',
            },
        });
    });

    test('performs an AJAX GET request with data (string)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, 'test1=Test%201&test2=Test%202');
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 200,
                url: 'http://localhost:3001/?test1=Test+1&test2=Test+2',
            },
        });
    });

    test('performs an AJAX GET request with content type', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, null, {
                contentType: 'text/plain',
            });
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'text/plain',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX GET request with response type', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, null, {
                responseType: 'json',
            });
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                responseType: 'json',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX GET request with MIME type', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, null, {
                mimeType: 'text/plain',
            });
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                mimeType: 'text/plain',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX GET request with username', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, null, {
                username: 'test',
            });
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                username: 'test',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX GET request with password', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, null, {
                password: 'test',
            });
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                password: 'test',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX GET request with timeout', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, null, {
                timeout: 1000,
            });
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 200,
                timeout: 1000,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX GET request (local)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, null, {
                isLocal: true,
            });
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                method: 'GET',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX GET request with custom headers', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.get(null, null, {
                headers: {
                    'Test': 'Test 1',
                },
            });
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Test': 'Test 1',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX GET request without cache', async ({ page }) => {
        const response = await page.evaluate(async (_) => {
            const response = await $.get(null, null, {
                cache: false,
            });
            response.xhr = response.xhr.data;
            return response;
        });

        const match = response.xhr.url.match(/\/?_=(\d+)/);

        expect(match).toBeTruthy();
    });

    test('performs an AJAX GET request without cache (query string)', async ({ page }) => {
        const response = await page.evaluate(async (_) => {
            const response = await $.get('/?test=1', null, {
                cache: false,
            });
            response.xhr = response.xhr.data;
            return response;
        });

        const match = response.xhr.url.match(/\/?test=1&_=(\d+)/);

        expect(match).toBeTruthy();
    });

    test('works with beforeSend callback', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            let result;
            await $.get(null, null, {
                beforeSend: (xhr) => {
                    result = {
                        ...xhr.data,
                    };
                },
            });
            return result;
        })).toEqual({
            async: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
            },
            method: 'GET',
            url: 'http://localhost:3001/',
        });
    });

    test('works with afterSend callback', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            let result;
            await $.get(null, null, {
                afterSend: (xhr) => {
                    result = {
                        ...xhr.data,
                    };
                },
            });
            return result;
        })).toEqual({
            async: true,
            body: null,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
            },
            method: 'GET',
            url: 'http://localhost:3001/',
        });
    });

    test('works with onProgress callback', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            let result;
            await $.get(null, null, {
                onProgress: (progress, xhr, event) => {
                    result = {
                        progress,
                        xhr: { ...xhr.data },
                        event,
                    };
                },
            });
            return result;
        })).toEqual({
            event: {
                isTrusted: false,
                loaded: 500,
                total: 1000,
            },
            progress: 0.5,
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                url: 'http://localhost:3001/',
            },
        });
    });

    test('works with onUploadProgress callback', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            let result;
            await $.get(null, null, {
                onUploadProgress: (progress, xhr, event) => {
                    result = {
                        progress,
                        xhr: { ...xhr.data },
                        event,
                    };
                },
            });
            return result;
        })).toEqual({
            event: {
                isTrusted: false,
                loaded: 5000,
                total: 10000,
            },
            progress: 0.5,
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                url: 'http://localhost:3001/',
            },
        });
    });

    test('can be cancelled', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            try {
                const ajax = $.get();
                ajax.cancel();
                await ajax;
                return false;
            } catch (error) {
                error.xhr = error.xhr.data;
                return error;
            }
        })).toEqual({
            reason: 'Request was cancelled',
            status: 200,
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                url: 'http://localhost:3001/',
            },
        });
    });

    test('throws on XHR error', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            try {
                const ajax = $.get();
                ajax.xhr.forceError = true;
                ajax.xhr.status = null;
                await ajax;
                return false;
            } catch (error) {
                error.xhr = error.xhr.data;
                return error;
            }
        })).toEqual({
            event: {
                isTrusted: false,
            },
            status: null,
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                url: 'http://localhost:3001/',
            },
        });
    });

    test('throws on status error', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            try {
                const ajax = $.get();
                ajax.xhr.status = 404;
                await ajax;
                return false;
            } catch (error) {
                error.xhr = error.xhr.data;
                return error;
            }
        })).toEqual({
            event: {
                isTrusted: false,
            },
            status: 404,
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 404,
                url: 'http://localhost:3001/',
            },
        });
    });
});
