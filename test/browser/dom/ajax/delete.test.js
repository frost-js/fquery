import { expect, test } from '#test';
import { resetPage } from '../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#delete', () => {
    test('performs an AJAX DELETE request', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.delete();
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
                method: 'DELETE',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX DELETE request with URL', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.delete('/test');
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
                method: 'DELETE',
                status: 200,
                url: '/test',
            },
        });
    });

    test('performs an AJAX DELETE request with content type', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.delete(null, {
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
                method: 'DELETE',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX DELETE request with response type', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.delete(null, {
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
                method: 'DELETE',
                responseType: 'json',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX DELETE request with MIME type', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.delete(null, {
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
                method: 'DELETE',
                mimeType: 'text/plain',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX DELETE request with username', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.delete(null, {
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
                method: 'DELETE',
                username: 'test',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX DELETE request with password', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.delete(null, {
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
                method: 'DELETE',
                password: 'test',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX DELETE request with timeout', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.delete(null, {
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
                method: 'DELETE',
                status: 200,
                timeout: 1000,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX DELETE request (local)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.delete(null, {
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
                method: 'DELETE',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX DELETE request with custom headers', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.delete(null, {
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
                method: 'DELETE',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX DELETE request without cache', async ({ page }) => {
        const response = await page.evaluate(async (_) => {
            const response = await $.delete(null, {
                cache: false,
            });
            response.xhr = response.xhr.data;
            return response;
        });

        const match = response.xhr.url.match(/\/?_=(\d+)/);

        expect(match).toBeTruthy();
    });

    test('performs an AJAX DELETE request without cache (query string)', async ({ page }) => {
        const response = await page.evaluate(async (_) => {
            const response = await $.delete('/?test=1', {
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
            await $.delete(null, {
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
            method: 'DELETE',
            url: 'http://localhost:3001/',
        });
    });

    test('works with afterSend callback', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            let result;
            await $.delete(null, {
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
            method: 'DELETE',
            url: 'http://localhost:3001/',
        });
    });

    test('works with onProgress callback', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            let result;
            await $.delete(null, {
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
                method: 'DELETE',
                url: 'http://localhost:3001/',
            },
        });
    });

    test('works with onUploadProgress callback', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            let result;
            await $.delete(null, {
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
                method: 'DELETE',
                url: 'http://localhost:3001/',
            },
        });
    });

    test('can be cancelled', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            try {
                const ajax = $.delete();
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
                method: 'DELETE',
                url: 'http://localhost:3001/',
            },
        });
    });

    test('throws on XHR error', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            try {
                const ajax = $.delete();
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
                method: 'DELETE',
                url: 'http://localhost:3001/',
            },
        });
    });

    test('throws on status error', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            try {
                const ajax = $.delete();
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
                method: 'DELETE',
                status: 404,
                url: 'http://localhost:3001/',
            },
        });
    });
});
