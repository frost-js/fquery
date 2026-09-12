import { expect, test } from '#test';

test.describe('#create', () => {
    test('creates a new node', async ({ page }) => {
        await page.evaluate(() => {
            document.body.appendChild($.create('div'));
        });

        await expect(page.locator('body > div')).toHaveCount(1);
    });

    test('creates nodes when a form shadows document.createElement', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<form name="createElement"></form>';
            return $.create('span', { text: 'Test' }).textContent;
        })).toBe('Test');
    });

    test.describe('content', () => {
        test('creates a new node with HTML', async ({ page }) => {
            await page.evaluate(() => {
                document.body.appendChild($.create('div', {
                    html: '<span>Test</span>',
                }));
            });

            await expect(page.locator('body > div > span')).toHaveText('Test');
        });

        test('creates a new node with text', async ({ page }) => {
            await page.evaluate(() => {
                document.body.appendChild($.create('div', {
                    text: '<span>Test</span>',
                }));
            });

            await expect(page.locator('body > div')).toHaveText('<span>Test</span>');
            await expect(page.locator('body > div > span')).toHaveCount(0);
            expect(await page.locator('body > div').innerHTML()).toBe('&lt;span&gt;Test&lt;/span&gt;');
        });
    });

    test.describe('styling', () => {
        test('creates a new node with classes', async ({ page }) => {
            await page.evaluate(() => {
                document.body.appendChild($.create('div', {
                    class: 'test',
                }));
            });

            await expect(page.locator('body > div')).toHaveClass('test');
        });

        test('creates a new node with styles', async ({ page }) => {
            await page.evaluate(() => {
                document.body.appendChild($.create('div', {
                    style: {
                        display: 'block',
                        width: '50px',
                    },
                }));
            });

            await expect(page.locator('body > div')).toHaveCSS('display', 'block');
            await expect(page.locator('body > div')).toHaveCSS('width', '50px');
        });

        test('creates a new node with custom properties', async ({ page }) => {
            await page.evaluate(() => {
                document.body.appendChild($.create('div', {
                    style: {
                        '--spacing-size': 100,
                        '--brandColor': 'red',
                    },
                }));
            });

            await expect(page.locator('body > div')).toHaveCSS('--spacing-size', '100');
            await expect(page.locator('body > div')).toHaveCSS('--brandColor', 'red');
        });
    });

    test.describe('attributes and properties', () => {
        test('creates a new node with value', async ({ page }) => {
            const value = await page.evaluate(() =>
                $.create('input', {
                    value: 'Test',
                }).value,
            );

            expect(value).toBe('Test');
        });

        test('creates a new node with attributes', async ({ page }) => {
            await page.evaluate(() => {
                document.body.appendChild($.create('input', {
                    attributes: {
                        type: 'number',
                        min: '1',
                        max: '10',
                    },
                }));
            });

            await expect(page.locator('body > input')).toHaveAttribute('type', 'number');
            await expect(page.locator('body > input')).toHaveAttribute('min', '1');
            await expect(page.locator('body > input')).toHaveAttribute('max', '10');
        });

        test('creates a new node with properties', async ({ page }) => {
            const value = await page.evaluate(() =>
                $.create('input', {
                    properties: {
                        test: 'Test',
                    },
                }).test,
            );

            expect(value).toBe('Test');
        });

        test('creates a new node with dataset values', async ({ page }) => {
            await page.evaluate(() => {
                document.body.appendChild($.create('div', {
                    dataset: {
                        text: 'Test',
                        number: 123.456,
                        true: true,
                        false: false,
                        null: null,
                        array: [1, 2, 3],
                        object: { a: 1 },
                    },
                }));
            });

            const dataset = await page.evaluate(() => ({ ...document.body.firstElementChild.dataset }));

            expect(dataset).toEqual({
                text: 'Test',
                number: '123.456',
                true: 'true',
                false: 'false',
                null: 'null',
                array: '[1,2,3]',
                object: '{"a":1}',
            });
        });
    });
});
