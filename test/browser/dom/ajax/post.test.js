import { expect, test } from '#test';
import { resetPage } from '../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#post', () => {
    test('performs an AJAX POST request', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post();
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

    test('performs an AJAX POST request with URL', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post('/test');
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
                url: '/test',
            },
        });
    });

    test('performs an AJAX POST request with data (object)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, {
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
                body: 'test1=Test%201&test2=Test%202',
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

    test('performs an AJAX POST request with data (object with charset)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, {
                test1: 'Test 1',
                test2: 'Test 2',
            }, {
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
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
                body: 'test1=Test%201&test2=Test%202',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'POST',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX POST request with data (deep object)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, {
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
                body: 'test1=Test%201&test2%5Ba%5D=1&test2%5Bb%5D=2',
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

    test('performs an AJAX POST request with data (implicit deep object)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, {
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
                body: 'test1=Test%201&test2%5Ba%5D=1&test2%5Bb%5D=2',
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

    test('performs an AJAX POST request with data (object with array)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, {
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
                body: 'test1=Test%201&test2%5B%5D=1&test2%5B%5D=2',
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

    test('performs an AJAX POST request with data (object with implicit array)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, {
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
                body: 'test1=Test%201&test2%5B%5D=1&test2%5B%5D=2',
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

    test('performs an AJAX POST request with data (array)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, [
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
                body: 'test1=Test%201&test2=Test%202',
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

    test('performs an AJAX POST request with data (deep array)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, [
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
                body: 'test1=Test%201&test2%5B%5D=1&test2%5B%5D=2',
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

    test('performs an AJAX POST request with data (implicit deep array)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, [
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
                body: 'test1=Test%201&test2%5B%5D=1&test2%5B%5D=2',
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

    test('performs an AJAX POST request with data (string)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, 'test1=Test%201&test2=Test%202');
            response.xhr = response.xhr.data;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: 'test1=Test%201&test2=Test%202',
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

    test('performs an AJAX POST request with data (JSON)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, {
                test1: 'Test 1',
                test2: 'Test 2',
            }, {
                contentType: 'application/json',
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
                body: '{"test1":"Test 1","test2":"Test 2"}',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'POST',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX POST request with data (JSON with charset)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, {
                test1: 'Test 1',
                test2: 'Test 2',
            }, {
                contentType: 'application/json; charset=utf-8',
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
                body: '{"test1":"Test 1","test2":"Test 2"}',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'POST',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX POST request with FormData', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, {
                test1: 'Test 1',
                test2: 'Test 2',
            }, {
                contentType: null,
            });
            response.xhr = response.xhr.data;
            const results = [];
            for (const [key, value] of response.xhr.body.entries()) {
                results.push({ key, value });
            }
            response.xhr.body = results;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: [
                    {
                        key: 'test1',
                        value: 'Test 1',
                    },
                    {
                        key: 'test2',
                        value: 'Test 2',
                    },
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

    test('performs an AJAX POST request with a File in FormData', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, {
                test1: new File(['Test 1'], 'test.txt', { type: 'text/plain' }),
            }, {
                contentType: null,
            });
            response.xhr = response.xhr.data;
            const results = [];
            for (const [key, value] of response.xhr.body.entries()) {
                results.push({
                    key,
                    value: {
                        name: value.name,
                        type: value.type,
                        text: await value.text(),
                    },
                });
            }
            response.xhr.body = results;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: [
                    {
                        key: 'test1',
                        value: {
                            name: 'test.txt',
                            type: 'text/plain',
                            text: 'Test 1',
                        },
                    },
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

    test('performs an AJAX POST request with a Blob in FormData', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, {
                test1: new Blob(['Test 1'], { type: 'text/plain' }),
            }, {
                contentType: null,
            });
            response.xhr = response.xhr.data;
            const results = [];
            for (const [key, value] of response.xhr.body.entries()) {
                results.push({
                    key,
                    value: {
                        name: value.name,
                        type: value.type,
                        text: await value.text(),
                    },
                });
            }
            response.xhr.body = results;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: [
                    {
                        key: 'test1',
                        value: {
                            name: 'blob',
                            type: 'text/plain',
                            text: 'Test 1',
                        },
                    },
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

    test('performs an AJAX POST request with repeated FormData names', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, [
                {
                    name: 'test1',
                    value: 'Test 1',
                },
                {
                    name: 'test2',
                    value: 'Test 2',
                },
                {
                    name: 'test1',
                    value: 'Test 3',
                },
            ], {
                contentType: null,
            });
            response.xhr = response.xhr.data;
            const results = [];
            for (const [key, value] of response.xhr.body.entries()) {
                results.push({ key, value });
            }
            response.xhr.body = results;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: [
                    {
                        key: 'test1',
                        value: 'Test 1',
                    },
                    {
                        key: 'test2',
                        value: 'Test 2',
                    },
                    {
                        key: 'test1',
                        value: 'Test 3',
                    },
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

    test('performs an AJAX POST request with FormData from a multiple select named tags', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            document.body.innerHTML =
                '<form>' +
                '<select name="tags" multiple>' +
                '<option value="Test 1" selected>Test 1</option>' +
                '<option value="Test 2" selected>Test 2</option>' +
                '</select>' +
                '</form>';
            const response = await $.post(null, $.serializeArray('form'), {
                contentType: null,
            });
            response.xhr = response.xhr.data;
            const results = [];
            for (const [key, value] of response.xhr.body.entries()) {
                results.push({ key, value });
            }
            response.xhr.body = results;
            return response;
        })).toEqual({
            event: {
                isTrusted: false,
            },
            response: 'Test',
            xhr: {
                async: true,
                body: [
                    {
                        key: 'tags',
                        value: 'Test 1',
                    },
                    {
                        key: 'tags',
                        value: 'Test 2',
                    },
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

    test('performs an AJAX POST request with content type', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, null, {
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
                method: 'POST',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX POST request with response type', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, null, {
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
                method: 'POST',
                responseType: 'json',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX POST request with MIME type', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, null, {
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
                method: 'POST',
                mimeType: 'text/plain',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX POST request with username', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, null, {
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
                method: 'POST',
                username: 'test',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX POST request with password', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, null, {
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
                method: 'POST',
                password: 'test',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX POST request with timeout', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, null, {
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
                method: 'POST',
                status: 200,
                timeout: 1000,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX POST request (local)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, null, {
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
                method: 'POST',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX POST request with custom headers', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const response = await $.post(null, null, {
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
                method: 'POST',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX POST request overriding a default header through method options', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            $.setAjaxDefaults({
                headers: {
                    'X-Test': 'Test 1',
                },
            });
            const response = await $.post(null, null, {
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
                method: 'POST',
                status: 200,
                url: 'http://localhost:3001/',
            },
        });
    });

    test('performs an AJAX POST request without cache', async ({ page }) => {
        const response = await page.evaluate(async (_) => {
            const response = await $.post(null, null, {
                cache: false,
            });
            response.xhr = response.xhr.data;
            return response;
        });

        const match = response.xhr.url.match(/\/?_=(\d+)/);

        expect(match).toBeTruthy();
    });

    test('performs an AJAX POST request without cache (query string)', async ({ page }) => {
        const response = await page.evaluate(async (_) => {
            const response = await $.post('/?test=1', null, {
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
            await $.post(null, null, {
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
            method: 'POST',
            url: 'http://localhost:3001/',
        });
    });

    test('works with afterSend callback', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            let result;
            await $.post(null, null, {
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
            method: 'POST',
            url: 'http://localhost:3001/',
        });
    });

    test('works with onProgress callback', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            let result;
            await $.post(null, null, {
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
                method: 'POST',
                url: 'http://localhost:3001/',
            },
        });
    });

    test('works with onUploadProgress callback', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            let result;
            await $.post(null, null, {
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
                method: 'POST',
                url: 'http://localhost:3001/',
            },
        });
    });

    test('can be cancelled', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            try {
                const ajax = $.post();
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
                method: 'POST',
                url: 'http://localhost:3001/',
            },
        });
    });

    test('throws on XHR error', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            try {
                const ajax = $.post();
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
                method: 'POST',
                url: 'http://localhost:3001/',
            },
        });
    });

    test('throws on status error', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            try {
                const ajax = $.post();
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
                method: 'POST',
                status: 404,
                url: 'http://localhost:3001/',
            },
        });
    });
});
