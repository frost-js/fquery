import { expect, test } from '#test';

test.describe('#ajax encoding', () => {
    test('sends a false request body', async ({ page }) => {
        expect(await page.evaluate(async () => {
            const response = await $.ajax({
                data: false,
                method: 'POST',
            });
            return response.xhr.data.body;
        })).toBe(false);
    });

    test.describe('URL encoding', () => {
        for (const [name, data, body, query] of [
            ['object', {
                test1: 'Test 1',
                test2: 'Test 2',
            }, 'test1=Test%201&test2=Test%202', 'test1=Test+1&test2=Test+2'],
            ['deep object', {
                test1: 'Test 1',
                test2: {
                    a: '1',
                    b: '2',
                },
            }, 'test1=Test%201&test2%5Ba%5D=1&test2%5Bb%5D=2', 'test1=Test+1&test2%5Ba%5D=1&test2%5Bb%5D=2'],
            ['implicit deep object', {
                'test1': 'Test 1',
                'test2[a]': '1',
                'test2[b]': '2',
            }, 'test1=Test%201&test2%5Ba%5D=1&test2%5Bb%5D=2', 'test1=Test+1&test2%5Ba%5D=1&test2%5Bb%5D=2'],
            ['object with array', {
                test1: 'Test 1',
                test2: ['1', '2'],
            }, 'test1=Test%201&test2%5B%5D=1&test2%5B%5D=2', 'test1=Test+1&test2%5B%5D=1&test2%5B%5D=2'],
            ['object with implicit array', {
                'test1': 'Test 1',
                'test2[]': ['1', '2'],
            }, 'test1=Test%201&test2%5B%5D=1&test2%5B%5D=2', 'test1=Test+1&test2%5B%5D=1&test2%5B%5D=2'],
            ['array', [
                {
                    name: 'test1',
                    value: 'Test 1',
                },
                {
                    name: 'test2',
                    value: 'Test 2',
                },
            ], 'test1=Test%201&test2=Test%202', 'test1=Test+1&test2=Test+2'],
            ['deep array', [
                {
                    name: 'test1',
                    value: 'Test 1',
                },
                {
                    name: 'test2',
                    value: ['1', '2'],
                },
            ], 'test1=Test%201&test2%5B%5D=1&test2%5B%5D=2', 'test1=Test+1&test2%5B%5D=1&test2%5B%5D=2'],
            ['implicit deep array', [
                {
                    name: 'test1',
                    value: 'Test 1',
                },
                {
                    name: 'test2[]',
                    value: ['1', '2'],
                },
            ], 'test1=Test%201&test2%5B%5D=1&test2%5B%5D=2', 'test1=Test+1&test2%5B%5D=1&test2%5B%5D=2'],
            ['string', 'test1=Test%201&test2=Test%202', 'test1=Test%201&test2=Test%202', 'test1=Test+1&test2=Test+2'],
        ]) {
            test(`encodes a request body (${name})`, async ({ page }) => {
                expect(await page.evaluate(async (data) => {
                    const response = await $.ajax({
                        method: 'POST',
                        data,
                    });
                    return response.xhr.data.body;
                }, data)).toBe(body);
            });

            test(`encodes query data (${name})`, async ({ page }) => {
                expect(await page.evaluate(async (data) => {
                    const response = await $.ajax({
                        method: 'GET',
                        data,
                    });
                    return response.xhr.data.url;
                }, data)).toBe(`http://localhost:3001/?${query}`);
            });
        }

        for (const method of ['GET', 'HEAD']) {
            for (const contentType of ['application/x-www-form-urlencoded', 'application/json']) {
                test(`appends ${method} data to an existing query (${contentType})`, async ({ page }) => {
                    expect(await page.evaluate(async ([method, contentType]) => {
                        const response = await $.ajax({
                            url: '/?test1=Test+1',
                            method,
                            data: {
                                test2: 'Test 2',
                            },
                            contentType,
                        });
                        return response.xhr.data.url;
                    }, [method, contentType])).toBe('http://localhost:3001/?test1=Test+1&test2=Test+2');
                });
            }

            test(`sends no body with ${method} query data`, async ({ page }) => {
                expect(await page.evaluate(async (method) => {
                    const response = await $.ajax({
                        method,
                        data: {
                            test: 'Test',
                        },
                    });
                    return response.xhr.data.body;
                }, method)).toBeNull();
            });
        }

        test('encodes parameter names and values', async ({ page }) => {
            expect(await page.evaluate(async () => {
                const response = await $.ajax({
                    data: {
                        'test&key': 'Test&value=1',
                    },
                });
                return response.xhr.data.url;
            })).toBe('http://localhost:3001/?test%26key=Test%26value%3D1');
        });
    });

    test.describe('content types', () => {
        for (const [name, options, body] of [
            ['URL-encoded with charset', {
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            }, 'test1=Test%201&test2=Test%202'],
            ['JSON', {
                contentType: 'application/json',
            }, '{"test1":"Test 1","test2":"Test 2"}'],
            ['JSON with charset', {
                contentType: 'application/json; charset=utf-8',
            }, '{"test1":"Test 1","test2":"Test 2"}'],
            ['JSON from a content-type header', {
                headers: {
                    'content-type': 'application/json',
                },
            }, '{"test1":"Test 1","test2":"Test 2"}'],
        ]) {
            test(`encodes object data (${name})`, async ({ page }) => {
                expect(await page.evaluate(async (options) => {
                    const response = await $.ajax({
                        method: 'POST',
                        data: {
                            test1: 'Test 1',
                            test2: 'Test 2',
                        },
                        ...options,
                    });
                    return response.xhr.data.body;
                }, options)).toBe(body);
            });
        }

        test('encodes JSON from a default content-type header', async ({ page }) => {
            expect(await page.evaluate(async () => {
                $.setAjaxDefaults({
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const response = await $.ajax({
                    method: 'POST',
                    data: {
                        test1: 'Test 1',
                        test2: 'Test 2',
                    },
                });
                return response.xhr.data.body;
            })).toBe('{"test1":"Test 1","test2":"Test 2"}');
        });
    });

    test.describe('FormData', () => {
        test('preserves FormData', async ({ page }) => {
            expect(await page.evaluate(async () => {
                const data = new FormData();
                data.append('test', 'Test');

                const response = await $.ajax({
                    data,
                    method: 'POST',
                });
                return [...response.xhr.data.body.entries()];
            })).toEqual([
                ['test', 'Test'],
            ]);
        });

        test('encodes object data as FormData', async ({ page }) => {
            expect(await page.evaluate(async () => {
                const response = await $.ajax({
                    method: 'POST',
                    data: {
                        test1: 'Test 1',
                        test2: 'Test 2',
                    },
                    contentType: null,
                });
                return [...response.xhr.data.body.entries()];
            })).toEqual([
                ['test1', 'Test 1'],
                ['test2', 'Test 2'],
            ]);
        });

        for (const name of ['object', 'FormData']) {
            test(`omits the content-type header for multipart data (${name})`, async ({ page }) => {
                expect(await page.evaluate(async (name) => {
                    const response = await $.ajax({
                        method: 'POST',
                        data: name === 'FormData' ? new FormData() : {
                            test: 'Test',
                        },
                        contentType: name === 'FormData' ? 'application/x-www-form-urlencoded' : null,
                    });
                    return response.xhr.data.headers;
                }, name)).toEqual({
                    'X-Requested-With': 'XMLHttpRequest',
                });
            });
        }

        for (const [type, name] of [
            ['File', 'test.txt'],
            ['Blob', 'blob'],
        ]) {
            test(`preserves a ${type} in FormData`, async ({ page }) => {
                expect(await page.evaluate(async (type) => {
                    const value = type === 'File' ?
                        new File(['Test 1'], 'test.txt', { type: 'text/plain' }) :
                        new Blob(['Test 1'], { type: 'text/plain' });
                    const response = await $.ajax({
                        method: 'POST',
                        data: {
                            test1: value,
                        },
                        contentType: null,
                    });

                    const results = [];
                    for (const [key, value] of response.xhr.data.body.entries()) {
                        results.push({
                            key,
                            value: {
                                name: value.name,
                                type: value.type,
                                text: await value.text(),
                            },
                        });
                    }

                    return results;
                }, type)).toEqual([
                    {
                        key: 'test1',
                        value: {
                            name,
                            type: 'text/plain',
                            text: 'Test 1',
                        },
                    },
                ]);
            });
        }

        test('preserves repeated names in FormData', async ({ page }) => {
            expect(await page.evaluate(async () => {
                const response = await $.ajax({
                    method: 'POST',
                    data: [
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
                    ],
                    contentType: null,
                });
                return [...response.xhr.data.body.entries()];
            })).toEqual([
                ['test1', 'Test 1'],
                ['test2', 'Test 2'],
                ['test1', 'Test 3'],
            ]);
        });

        test('preserves multiple select values in FormData', async ({ page }) => {
            expect(await page.evaluate(async () => {
                document.body.innerHTML =
                    '<form>' +
                    '<select name="tags" multiple>' +
                    '<option value="Test 1" selected>Test 1</option>' +
                    '<option value="Test 2" selected>Test 2</option>' +
                    '</select>' +
                    '</form>';

                const response = await $.ajax({
                    method: 'POST',
                    data: $.serializeArray('form'),
                    contentType: null,
                });
                return [...response.xhr.data.body.entries()];
            })).toEqual([
                ['tags', 'Test 1'],
                ['tags', 'Test 2'],
            ]);
        });
    });
});
