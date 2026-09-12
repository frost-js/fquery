/** @import { Page } from '@playwright/test'; */
/** @import { addEventDelegate } from '../../../../src/events/event-handlers.js'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate((_) => {
        document.body.innerHTML =
            '<div id="parent1">' +
            '<a href="#" id="test1">Test</a>' +
            '<span>' +
            '<a href="#" id="test2">Test</a>' +
            '</span>' +
            '</div>' +
            '<div id="parent2">' +
            '<a href="#" id="test3">Test</a>' +
            '<span>' +
            '<a href="#" id="test4">Test</a>' +
            '</span>' +
            '</div>';
    });
};

/**
 * Registers shared addEventDelegate behavior tests.
 * @param {() => typeof addEventDelegate} createAddEventDelegate Creates the browser-side method adapter.
 */
export function addEventDelegateTests(createAddEventDelegate) {
    for (const [group, cases] of [
        ['registration', [
            ['adds a delegated event to each node', 'click', ['click'], 8],
            ['adds delegated events to each node', 'click hover', ['click', 'hover'], 16],
        ]],
        ['namespaces', [
            ['adds a namespaced delegated event to each node', 'click.test', ['click'], 8],
            ['adds namespaced delegated events to each node', 'click.test hover.test', ['click', 'hover'], 16],
            ['adds a deep namespaced delegated event to each node', 'click.test.deep', ['click'], 8],
            ['adds deep namespaced delegated events to each node', 'click.test.deep hover.test.deep', ['click', 'hover'], 16],
        ]],
    ]) {
        test.describe(group, () => {
            for (const [name, registeredEvents, eventTypes, expected] of cases) {
                test(name, async ({ page }) => {
                    const operation = await page.evaluateHandle(createAddEventDelegate);

                    const calls = await page.evaluateHandle(() => ({ count: 0 }));
                    const args = await page.evaluateHandle(({ calls, events }) => [
                        'div', events, 'a',
                        () => {
                            calls.count++;
                        },
                    ], { calls, events: registeredEvents });

                    await operation.evaluate((operation, args) => operation(...args), args);

                    const count = await calls.evaluate((calls, eventTypes) => {
                        const events = eventTypes.map((type) => new Event(type, { bubbles: true }));

                        for (const node of document.querySelectorAll('a')) {
                            for (const event of events) {
                                node.dispatchEvent(event);
                                node.dispatchEvent(event);
                            }
                        }

                        return calls.count;
                    }, eventTypes);

                    expect(count).toBe(expected);
                });
            }
        });
    }

    test.describe('scoped selectors', () => {
        test('matches compound scoped selectors', async ({ page }) => {
            const operation = await page.evaluateHandle(createAddEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                operation('div', 'click', 'div:scope > a', (_) => {
                    result++;
                });
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            }, operation)).toBe(2);
        });

        test('matches nested scoped selectors', async ({ page }) => {
            const operation = await page.evaluateHandle(createAddEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                operation('div', 'click', ':is(:scope > a)', (_) => {
                    result++;
                });
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            }, operation)).toBe(2);
        });
    });

    test.describe('event property restoration', () => {
        test('restores currentTarget for later native listeners', async ({ page }) => {
            const operation = await page.evaluateHandle(createAddEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = false;
                const event = new Event('click', {
                    bubbles: true,
                });
                const parent = document.getElementById('parent1');
                const element = document.getElementById('test1');
                operation(parent, 'click', 'a', (_) => null);
                parent.addEventListener('click', (e) => {
                    result = e.currentTarget === parent;
                });
                element.dispatchEvent(event);
                return result;
            }, operation)).toBe(true);
        });

        test('removes delegateTarget for later native listeners', async ({ page }) => {
            const operation = await page.evaluateHandle(createAddEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = false;
                const event = new Event('click', {
                    bubbles: true,
                });
                const parent = document.getElementById('parent1');
                const element = document.getElementById('test1');
                operation(parent, 'click', 'a', (_) => null);
                parent.addEventListener('click', (e) => {
                    result = e.delegateTarget === undefined;
                });
                element.dispatchEvent(event);
                return result;
            }, operation)).toBe(true);
        });

        test('restores currentTarget as the event bubbles', async ({ page }) => {
            const operation = await page.evaluateHandle(createAddEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = false;
                const event = new Event('click', {
                    bubbles: true,
                });
                const parent = document.getElementById('parent1');
                const element = document.getElementById('test1');
                operation(parent, 'click', 'a', (_) => null);
                $.addEvent(parent, 'click', (_) => null);
                document.body.addEventListener('click', (e) => {
                    result = e.currentTarget === document.body;
                });
                element.dispatchEvent(event);
                return result;
            }, operation)).toBe(true);
        });

        test('restores currentTarget when a delegated callback throws', async ({ page }) => {
            const operation = await page.evaluateHandle(createAddEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = false;
                const event = new Event('click', {
                    bubbles: true,
                });
                const parent = document.getElementById('parent1');
                const element = document.getElementById('test1');
                window.addEventListener('error', (e) => {
                    e.preventDefault();
                }, { once: true });
                operation(parent, 'click', 'a', (_) => {
                    throw new Error('Test error');
                });
                parent.addEventListener('click', (e) => {
                    result = e.currentTarget === parent;
                });
                element.dispatchEvent(event);
                return result;
            }, operation)).toBe(true);
        });

        test('removes delegateTarget when a delegated callback throws', async ({ page }) => {
            const operation = await page.evaluateHandle(createAddEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = false;
                const event = new Event('click', {
                    bubbles: true,
                });
                const parent = document.getElementById('parent1');
                const element = document.getElementById('test1');
                window.addEventListener('error', (e) => {
                    e.preventDefault();
                }, { once: true });
                operation(parent, 'click', 'a', (_) => {
                    throw new Error('Test error');
                });
                parent.addEventListener('click', (e) => {
                    result = e.delegateTarget === undefined;
                });
                element.dispatchEvent(event);
                return result;
            }, operation)).toBe(true);
        });
    });

    test.describe('capture', () => {
        test('does not capture events', async ({ page }) => {
            const operation = await page.evaluateHandle(createAddEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                operation('div', 'click', 'a', (_) => {
                    result++;
                });
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            }, operation)).toBe(0);
        });

        test('works with capture', async ({ page }) => {
            const operation = await page.evaluateHandle(createAddEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                operation('div', 'click', 'a', (_) => {
                    result++;
                }, { capture: true });
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            }, operation)).toBe(8);
        });
    });
}
