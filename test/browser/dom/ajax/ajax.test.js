import { expect, test } from '#test';
import { resetPage } from '../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#ajax', () => {
    test('performs an AJAX request', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax();
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

    test('performs an AJAX request with URL', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
                url: '/test',
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
                url: '/test',
            },
        });
    });

    test('performs an AJAX request with method', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
                method: 'POST',
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
                method: 'POST',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX request with data (object)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
                data: {
                    test1: 'Test 1',
                    test2: 'Test 2',
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
                url: 'http://localhost:3001/?test1=Test+1&test2=Test+2',
            },
        });
    });

    test('performs an AJAX request with data (deep object)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
                data: {
                    test1: 'Test 1',
                    test2: {
                        a: '1',
                        b: '2',
                    },
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

    test('performs an AJAX request with data (implicit deep object)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
                data: {
                    'test1': 'Test 1',
                    'test2[a]': '1',
                    'test2[b]': '2',
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

    test('performs an AJAX request with data (object with array)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
                data: {
                    test1: 'Test 1',
                    test2: ['1', '2'],
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
                url: 'http://localhost:3001/?test1=Test+1&test2%5B%5D=1&test2%5B%5D=2',
            },
        });
    });

    test('performs an AJAX request with data (object with implicit array)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
                data: {
                    'test1': 'Test 1',
                    'test2[]': ['1', '2'],
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
                url: 'http://localhost:3001/?test1=Test+1&test2%5B%5D=1&test2%5B%5D=2',
            },
        });
    });

    test('performs an AJAX request with data (array)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
                data: [
                    {
                        name: 'test1',
                        value: 'Test 1',
                    },
                    {
                        name: 'test2',
                        value: 'Test 2',
                    },
                ],
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

    test('performs an AJAX request with data (deep array)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
                data: [
                    {
                        name: 'test1',
                        value: 'Test 1',
                    },
                    {
                        name: 'test2',
                        value: ['1', '2'],
                    },
                ],
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

    test('performs an AJAX request with data (implicit deep array)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
                data: [
                    {
                        name: 'test1',
                        value: 'Test 1',
                    },
                    {
                        name: 'test2[]',
                        value: ['1', '2'],
                    },
                ],
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

    test('performs an AJAX request with data (string)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
                data: 'test1=Test%201&test2=Test%202',
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

    test('normalizes the request method', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
                method: 'get',
            });
            return response.xhr.data.method;
        })).toBe('GET');
    });

    test('sends a false request body', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
                data: false,
                method: 'POST',
            });
            return response.xhr.data.body;
        })).toBe(false);
    });

    test('encodes parameter names and values', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
                data: {
                    'test&key': 'Test&value=1',
                },
            });
            return response.xhr.data.url;
        })).toBe('http://localhost:3001/?test%26key=Test%26value%3D1');
    });

    test('preserves FormData', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const data = new FormData;
            data.append('test', 'Test');

            const response = await $.ajax({
                data,
                method: 'POST',
            });
            response.xhr = response.xhr.data;
            response.xhr.body = [...response.xhr.body.entries()];
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: [
                    ['test', 'Test'],
                ],
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'POST',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX request with content type', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
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

    test('performs an AJAX request with response type', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
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

    test('performs an AJAX request with MIME type', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
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

    test('performs an AJAX request with username', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
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

    test('performs an AJAX request with password', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
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

    test('performs an AJAX request with timeout', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
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

    test('performs an AJAX request (local)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
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

    test('performs an AJAX request with custom headers', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.ajax({
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

    test('performs an AJAX request without cache', async ({ page }) => {
        const response = await page.evaluate(async (_) => {
            const response = await $.ajax({
                cache: false,
            });
            response.xhr = response.xhr.data;
            return response;
        });

        const match = response.xhr.url.match(/\/?_=(\d+)/);

        expect(match).toBeTruthy();
    });

    test('performs an AJAX request without cache (query string)', async ({ page }) => {
        const response = await page.evaluate(async (_) => {
            const response = await $.ajax({
                url: '/?test=1',
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
            await $.ajax({
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
            await $.ajax({
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
            await $.ajax({
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
            await $.ajax({
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
                const ajax = $.ajax();
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
                const ajax = $.ajax();
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

    test('throws on timeout', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            try {
                const ajax = $.ajax();
                ajax.xhr.ontimeout(new Event('timeout'));
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

    test('throws on status error', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            try {
                const ajax = $.ajax();
                ajax.xhr.status = 400;
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
            status: 400,
            xhr: {
                async: true,
                body: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'GET',
                status: 400,
                url: 'http://localhost:3001/',
            },
        });
    });
});
