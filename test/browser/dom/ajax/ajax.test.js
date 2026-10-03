import { expect, test } from '#test';

test.describe('#ajax', () => {
    test('performs an AJAX request', async ({ page }) => {
        expect(await page.evaluate(async () => {
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

    test.describe('URL resolution', () => {
        test('performs an AJAX request with URL', async ({ page }) => {
            expect(await page.evaluate(async () => {
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

        test('performs an AJAX request with a relative URL and data', async ({ page }) => {
            expect(await page.evaluate(async () => {
                window.history.replaceState(null, '', '/app/');

                const response = await $.ajax({
                    url: './api',
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
                    url: 'http://localhost:3001/app/api?test1=Test+1&test2=Test+2',
                },
            });
        });

        test('performs an AJAX request with a relative URL matching the hostname and data', async ({ page }) => {
            expect(await page.evaluate(async () => {
                window.history.replaceState(null, '', '/app/');

                const response = await $.ajax({
                    url: 'localhost',
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
                    url: 'http://localhost:3001/app/localhost?test1=Test+1&test2=Test+2',
                },
            });
        });

        test('performs an AJAX request with a relative URL and data using the document base URL', async ({ page }) => {
            expect(await page.evaluate(async () => {
                document.head.innerHTML = '<base href="/app/">';

                const response = await $.ajax({
                    url: './api',
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
                    url: 'http://localhost:3001/app/api?test1=Test+1&test2=Test+2',
                },
            });
        });
    });

    test.describe('request options', () => {
        test('performs an AJAX request with method', async ({ page }) => {
            expect(await page.evaluate(async () => {
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

        test('normalizes the request method', async ({ page }) => {
            expect(await page.evaluate(async () => {
                const response = await $.ajax({
                    method: 'get',
                });
                return response.xhr.data.method;
            })).toBe('GET');
        });

        test('performs an AJAX request with content type', async ({ page }) => {
            expect(await page.evaluate(async () => {
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
            expect(await page.evaluate(async () => {
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
            expect(await page.evaluate(async () => {
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
            expect(await page.evaluate(async () => {
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
            expect(await page.evaluate(async () => {
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
            expect(await page.evaluate(async () => {
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
            expect(await page.evaluate(async () => {
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
    });

    test.describe('headers', () => {
        test('performs an AJAX request with custom headers', async ({ page }) => {
            expect(await page.evaluate(async () => {
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

        test('performs an AJAX request with a lowercase content-type header', async ({ page }) => {
            expect(await page.evaluate(async () => {
                const response = await $.ajax({
                    headers: {
                        'content-type': 'application/json',
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
                        'content-type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    method: 'GET',
                    status: 200,
                    url: 'http://localhost:3001/',
                },
            });
        });

        test('performs an AJAX request with a mixed-case content-type header', async ({ page }) => {
            expect(await page.evaluate(async () => {
                const response = await $.ajax({
                    headers: {
                        'cOnTeNt-TyPe': 'application/json',
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
                        'cOnTeNt-TyPe': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    method: 'GET',
                    status: 200,
                    url: 'http://localhost:3001/',
                },
            });
        });

        test('performs an AJAX request with a lowercase x-requested-with header', async ({ page }) => {
            expect(await page.evaluate(async () => {
                const response = await $.ajax({
                    headers: {
                        'x-requested-with': 'Test',
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
                        'x-requested-with': 'Test',
                    },
                    method: 'GET',
                    status: 200,
                    url: 'http://localhost:3001/',
                },
            });
        });

        test('performs an AJAX request with a mixed-case x-requested-with header', async ({ page }) => {
            expect(await page.evaluate(async () => {
                const response = await $.ajax({
                    headers: {
                        'x-ReQuEsTeD-wItH': 'Test',
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
                        'x-ReQuEsTeD-wItH': 'Test',
                    },
                    method: 'GET',
                    status: 200,
                    url: 'http://localhost:3001/',
                },
            });
        });

        test('performs an AJAX request with a default content-type header', async ({ page }) => {
            expect(await page.evaluate(async () => {
                $.setAjaxDefaults({
                    headers: {
                        'content-type': 'application/json',
                    },
                });
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
                        'content-type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    method: 'GET',
                    status: 200,
                    url: 'http://localhost:3001/',
                },
            });
        });

        test('performs an AJAX request with a default x-requested-with header', async ({ page }) => {
            expect(await page.evaluate(async () => {
                $.setAjaxDefaults({
                    headers: {
                        'x-requested-with': 'Test',
                    },
                });
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
                        'x-requested-with': 'Test',
                    },
                    method: 'GET',
                    status: 200,
                    url: 'http://localhost:3001/',
                },
            });
        });

        test('performs an AJAX request overriding a default content-type header with different casing', async ({ page }) => {
            expect(await page.evaluate(async () => {
                $.setAjaxDefaults({
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                });
                const response = await $.ajax({
                    headers: {
                        'content-type': 'application/json',
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
                        'content-type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    method: 'GET',
                    status: 200,
                    url: 'http://localhost:3001/',
                },
            });
        });

        test('performs an AJAX request overriding a default x-requested-with header with different casing', async ({ page }) => {
            expect(await page.evaluate(async () => {
                $.setAjaxDefaults({
                    headers: {
                        'X-Requested-With': 'Test 1',
                    },
                });
                const response = await $.ajax({
                    headers: {
                        'x-ReQuEsTeD-wItH': 'Test 2',
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
                        'x-ReQuEsTeD-wItH': 'Test 2',
                    },
                    method: 'GET',
                    status: 200,
                    url: 'http://localhost:3001/',
                },
            });
        });

        test('performs an AJAX request overriding a custom default header with different casing', async ({ page }) => {
            expect(await page.evaluate(async () => {
                $.setAjaxDefaults({
                    headers: {
                        'X-Test': 'Test 1',
                    },
                });
                const response = await $.ajax({
                    headers: {
                        'x-test': 'Test 2',
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
                        'x-test': 'Test 2',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    method: 'GET',
                    status: 200,
                    url: 'http://localhost:3001/',
                },
            });
        });

        test('performs an AJAX request with headers from defaults and request options', async ({ page }) => {
            expect(await page.evaluate(async () => {
                $.setAjaxDefaults({
                    headers: {
                        'X-Default': 'Test 1',
                    },
                });
                const response = await $.ajax({
                    headers: {
                        'X-Test': 'Test 2',
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
                        'X-Default': 'Test 1',
                        'X-Test': 'Test 2',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    method: 'GET',
                    status: 200,
                    url: 'http://localhost:3001/',
                },
            });
        });

        test('performs an AJAX request using the last spelling and value of a repeated header', async ({ page }) => {
            expect(await page.evaluate(async () => {
                const response = await $.ajax({
                    headers: {
                        'X-Test': 'Test 1',
                        'x-test': 'Test 2',
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
                        'x-test': 'Test 2',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    method: 'GET',
                    status: 200,
                    url: 'http://localhost:3001/',
                },
            });
        });
    });

    test.describe('caching', () => {
        test('performs an AJAX request without cache', async ({ page }) => {
            const response = await page.evaluate(async () => {
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
            const response = await page.evaluate(async () => {
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

        test('performs an AJAX request without cache with a relative URL matching the hostname', async ({ page }) => {
            const response = await page.evaluate(async () => {
                window.history.replaceState(null, '', '/app/');

                const response = await $.ajax({
                    url: 'localhost',
                    cache: false,
                });
                response.xhr = response.xhr.data;
                return response;
            });

            const match = response.xhr.url.match(/^http:\/\/localhost:3001\/app\/localhost\?_=(\d+)$/);

            expect(match).toBeTruthy();
        });

        test('performs an AJAX request without cache using the document base URL', async ({ page }) => {
            const response = await page.evaluate(async () => {
                document.head.innerHTML = '<base href="/app/">';

                const response = await $.ajax({
                    url: './api?test=1',
                    cache: false,
                });
                response.xhr = response.xhr.data;
                return response;
            });

            const match = response.xhr.url.match(/^http:\/\/localhost:3001\/app\/api\?test=1&_=(\d+)$/);

            expect(match).toBeTruthy();
        });
    });

    test.describe('callbacks', () => {
        test('works with beforeSend callback', async ({ page }) => {
            expect(await page.evaluate(async () => {
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
            expect(await page.evaluate(async () => {
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
            expect(await page.evaluate(async () => {
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
            expect(await page.evaluate(async () => {
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
    });

    test.describe('cancellation', () => {
        test('can be cancelled', async ({ page }) => {
            expect(await page.evaluate(async () => {
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

        test('can be cancelled with a custom reason', async ({ page }) => {
            expect(await page.evaluate(async () => {
                try {
                    const ajax = $.ajax();
                    ajax.cancel('Custom reason');
                    await ajax;
                    return false;
                } catch (error) {
                    error.xhr = error.xhr.data;
                    return error;
                }
            })).toEqual({
                reason: 'Custom reason',
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

        test('can be cancelled without rejecting', async ({ page }) => {
            expect(await page.evaluate(async () => {
                let rejected = false;
                const ajax = $.ajax({
                    rejectOnCancel: false,
                });
                ajax.catch(() => {
                    rejected = true;
                });
                ajax.cancel();
                await Promise.resolve();
                return rejected;
            })).toBe(false);
        });

        test('can be aborted from afterSend callback', async ({ page }) => {
            expect(await page.evaluate(async () => {
                try {
                    await $.ajax({
                        afterSend: (xhr) => {
                            xhr.abort();
                        },
                    });
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

        test('can be aborted from afterSend callback without rejecting', async ({ page }) => {
            expect(await page.evaluate(async () => {
                let rejected = false;
                const ajax = $.ajax({
                    rejectOnCancel: false,
                    afterSend: (xhr) => {
                        xhr.abort();
                    },
                });
                ajax.catch(() => {
                    rejected = true;
                });
                await Promise.resolve();
                return rejected;
            })).toBe(false);
        });
    });

    test.describe('failures', () => {
        test('throws on XHR error', async ({ page }) => {
            expect(await page.evaluate(async () => {
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

        test('throws on XHR error (local)', async ({ page }) => {
            expect(await page.evaluate(async () => {
                try {
                    const ajax = $.ajax({
                        isLocal: true,
                    });
                    ajax.xhr.forceError = true;
                    ajax.xhr.status = 0;
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
                status: 0,
                xhr: {
                    async: true,
                    body: null,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    method: 'GET',
                    url: 'http://localhost:3001/',
                },
            });
        });

        test('throws on timeout', async ({ page }) => {
            expect(await page.evaluate(async () => {
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
            expect(await page.evaluate(async () => {
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
});
