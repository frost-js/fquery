/** @import { Page } from '@playwright/test'; */
/** @import { unwrap } from '../../../../src/manipulation/wrap.js'; */

import { expect, test } from '#test';
import { advanceClock, setupClock } from '../../../setup/browser.js';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML =
            '<div id="parent1">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '<div id="parent2">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>';
    });
};

/**
 * Registers shared unwrap behavior tests.
 * @param {() => typeof unwrap} createUnwrap Creates the browser-side method adapter.
 */
export function unwrapTests(createUnwrap) {
    const unwrappedHtml = '<a href="#" id="test1">Test</a>' +
        '<a href="#" id="test2">Test</a>' +
        '<a href="#" id="test3">Test</a>' +
        '<a href="#" id="test4">Test</a>';
    const filteredHtml = '<a href="#" id="test1">Test</a>' +
        '<a href="#" id="test2">Test</a>' +
        '<div id="parent2">' +
        '<a href="#" id="test3">Test</a>' +
        '<a href="#" id="test4">Test</a>' +
        '</div>';

    test('unwraps each node', async ({ page }) => {
        const operation = await page.evaluateHandle(createUnwrap);

        await operation.evaluate((operation, args) => operation(...args), ['a']);
        const html = await page.evaluate(() => document.body.innerHTML);

        expect(html).toBe(unwrappedHtml);
    });

    test.describe('filters', () => {
        for (const [name, createFilter, expected] of [
            ['unwraps each node with filter', () => '#parent1', filteredHtml],
            ['works with function filter', () => (node) => node.id === 'parent1', filteredHtml],
            ['works with HTMLElement filter', () => document.getElementById('parent1'), filteredHtml],
            ['works with NodeList filter', () => document.querySelectorAll('#parent1'), filteredHtml],
            ['works with HTMLCollection filter', () => document.body.children, unwrappedHtml],
            ['works with array filter', () => [document.getElementById('parent1')], filteredHtml],
        ]) {
            test(name, async ({ page }) => {
                const operation = await page.evaluateHandle(createUnwrap);

                const filter = await page.evaluateHandle(createFilter);
                await operation.evaluate((operation, args) => operation(...args), ['a', filter]);
                const html = await page.evaluate(() => document.body.innerHTML);

                expect(html).toBe(expected);
            });
        }
    });

    test.describe('cleanup', () => {
        test('removes events', async ({ page }) => {
            const operation = await page.evaluateHandle(createUnwrap);

            const count = await page.evaluate((operation) => {
                let result = 0;
                const parents = [...document.querySelectorAll('div')];

                $.addEvent('div', 'click', () => {
                    result++;
                });
                operation('a');

                for (const parent of parents) {
                    document.body.appendChild(parent);
                }

                $.triggerEvent('div', 'click');

                return result;
            }, operation);

            expect(count).toBe(0);
        });

        test('removes data', async ({ page }) => {
            const operation = await page.evaluateHandle(createUnwrap);

            const values = await page.evaluate((operation) => {
                const parents = [...document.querySelectorAll('div')];

                $.setData('div', 'test', 'Test');
                operation('a');

                for (const parent of parents) {
                    document.body.appendChild(parent);
                }

                return [...document.querySelectorAll('div')].map((node) => $.getData(node, 'test'));
            }, operation);

            expect(values).toEqual([
                undefined,
                undefined,
            ]);
        });

        test('removes animations', async ({ page }) => {
            const operation = await page.evaluateHandle(createUnwrap);

            await setupClock(page);

            await page.evaluate(() => {
                $.animate(
                    'div',
                    () => {},
                    {
                        duration: 100,
                        debug: true,
                    },
                );
            });

            await advanceClock(page, 20);

            expect(await page.evaluate(() =>
                Boolean(document.querySelector('#parent1')?.dataset.animationProgress) &&
                Boolean(document.querySelector('#parent2')?.dataset.animationProgress),
            )).toBe(true);

            const state = await page.evaluate((operation) => {
                const parents = [...document.querySelectorAll('div')];

                operation('a');

                for (const parent of parents) {
                    document.body.appendChild(parent);
                }

                return {
                    html: document.body.innerHTML,
                    parent1: document.querySelector('#parent1')?.dataset.animationProgress ?? null,
                    parent2: document.querySelector('#parent2')?.dataset.animationProgress ?? null,
                };
            }, operation);

            expect(state).toEqual({
                html: '<a href="#" id="test1">Test</a>' +
                    '<a href="#" id="test2">Test</a>' +
                    '<a href="#" id="test3">Test</a>' +
                    '<a href="#" id="test4">Test</a>' +
                    '<div id="parent1"></div>' +
                    '<div id="parent2"></div>',
                parent1: null,
                parent2: null,
            });
        });

        test('removes queue', async ({ page }) => {
            const operation = await page.evaluateHandle(createUnwrap);

            const state = await page.evaluate(async (operation) => {
                const parents = [...document.querySelectorAll('div')];
                const queueResolvers = [];
                let resolveAllStarted;
                const allStarted = new Promise((resolve) => {
                    resolveAllStarted = resolve;
                });

                $.queue('div', () =>
                    new Promise((resolve) => {
                        queueResolvers.push(resolve);

                        if (queueResolvers.length === parents.length) {
                            resolveAllStarted();
                        }
                    }),
                );
                $.queue('div', (node) => {
                    node.dataset.test = 'Test';
                });

                await allStarted;

                operation('a');

                for (const parent of parents) {
                    document.body.appendChild(parent);
                }

                queueResolvers.forEach((resolve) => {
                    resolve();
                });

                await new Promise((resolve) => {
                    setTimeout(resolve, 0);
                });

                return {
                    html: document.body.innerHTML,
                    values: [...document.querySelectorAll('div')].map((node) => node.getAttribute('data-test')),
                };
            }, operation);

            expect(state).toEqual({
                html: '<a href="#" id="test1">Test</a>' +
                    '<a href="#" id="test2">Test</a>' +
                    '<a href="#" id="test3">Test</a>' +
                    '<a href="#" id="test4">Test</a>' +
                    '<div id="parent1"></div>' +
                    '<div id="parent2"></div>',
                values: [
                    null,
                    null,
                ],
            });
        });
    });

    test.describe('detached and shadow parents', () => {
        test('preserves events when the parent is a shadow root', async ({ page }) => {
            const operation = await page.evaluateHandle(createUnwrap);

            const count = await page.evaluate((operation) => {
                let result = 0;
                const node = document.getElementById('test1');
                const shadow = document.getElementById('parent1').attachShadow({ mode: 'open' });
                shadow.appendChild(node);

                $.addEvent([shadow, node], 'click', () => {
                    result++;
                });
                operation(node);
                $.triggerEvent(node, 'click');

                return result;
            }, operation);

            expect(count).toBe(2);
            await expect(page.locator('#test1')).toHaveText('Test');
        });

        test('preserves events when the parent is detached', async ({ page }) => {
            const operation = await page.evaluateHandle(createUnwrap);

            const count = await page.evaluate((operation) => {
                let result = 0;
                const parent = document.getElementById('parent1');
                const node = document.getElementById('test1');
                parent.remove();

                $.addEvent([parent, node], 'click', () => {
                    result++;
                });
                operation(node);
                $.triggerEvent(node, 'click');
                document.body.appendChild(parent);

                return result;
            }, operation);

            expect(count).toBe(2);
            await expect(page.locator('#parent1 > #test1')).toHaveText('Test');
        });

        test('preserves data when the parent is a shadow root', async ({ page }) => {
            const operation = await page.evaluateHandle(createUnwrap);

            const values = await page.evaluate((operation) => {
                const node = document.getElementById('test1');
                const shadow = document.getElementById('parent1').attachShadow({ mode: 'open' });
                shadow.appendChild(node);

                $.setData([shadow, node], 'test', 'Test');
                operation(node);

                return [shadow, node].map((node) => $.getData(node, 'test'));
            }, operation);

            expect(values).toEqual([
                'Test',
                'Test',
            ]);
            await expect(page.locator('#test1')).toHaveText('Test');
        });

        test('preserves data when the parent is detached', async ({ page }) => {
            const operation = await page.evaluateHandle(createUnwrap);

            const values = await page.evaluate((operation) => {
                const parent = document.getElementById('parent1');
                const node = document.getElementById('test1');
                parent.remove();

                $.setData([parent, node], 'test', 'Test');
                operation(node);
                document.body.appendChild(parent);

                return [parent, node].map((node) => $.getData(node, 'test'));
            }, operation);

            expect(values).toEqual([
                'Test',
                'Test',
            ]);
            await expect(page.locator('#parent1 > #test1')).toHaveText('Test');
        });
    });

    test.describe('removal events', () => {
        test('triggers a remove event', async ({ page }) => {
            const operation = await page.evaluateHandle(createUnwrap);

            const count = await page.evaluate((operation) => {
                let result = 0;

                $.addEvent('div', 'remove', () => {
                    result++;
                });
                operation('a');

                return result;
            }, operation);

            expect(count).toBe(2);
        });
    });
}
