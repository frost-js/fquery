/** @import { Page } from '@playwright/test'; */
/** @import { removeEventDelegate } from '../../../../src/events/event-handlers.js'; */

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
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '<div id="parent2">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>';
    });
};

/**
 * Registers shared removeEventDelegate behavior tests.
 * @param {() => typeof removeEventDelegate} createRemoveEventDelegate Creates the browser-side method adapter.
 */
export function removeEventDelegateTests(createRemoveEventDelegate) {
    test.describe('namespaces', () => {
        for (const [name, registeredEvents, removedEvents, expected] of [
            ['removes a namespaced delegated event from each node', 'click.test', 'click', 0],
            ['removes namespaced delegated events from each node', 'click.test hover.test', 'click hover', 0],
            ['removes a deep namespaced delegated event from each node', 'click.test.deep', 'click', 0],
            ['removes deep namespaced delegated events from each node', 'click.test.deep hover.test.deep', 'click hover', 0],
            ['removes a namespaced delegated event with namespacing from each node', 'click.test', 'click.test', 0],
            ['removes namespaced delegated events with namespacing from each node', 'click.test hover.test', 'click.test hover.test', 0],
            ['removes a deep namespaced delegated event with namespacing from each node', 'click.test.deep', 'click.test', 0],
            ['removes deep namespaced delegated events with namespacing from each node', 'click.test.deep hover.test.deep', 'click.test hover.test', 0],
            ['removes a deep namespaced delegated event with deep namespacing from each node', 'click.test.deep', 'click.test.deep', 0],
            ['removes deep namespaced delegated events with deep namespacing from each node', 'click.test.deep hover.test.deep', 'click.test.deep hover.test.deep', 0],
            ['does not remove a delegated event without namespacing from each node', 'click', 'click.test', 4],
            ['does not remove delegated events without namespacing from each node', 'click hover', 'click.test hover.test', 8],
            ['does not remove a namespaced delegated event with deep namespacing from each node', 'click.test', 'click.test.deep', 4],
            ['does not remove namespaced delegated events with deep namespacing from each node', 'click.test hover.test', 'click.test.deep hover.test.deep', 8],
        ]) {
            test(name, async ({ page }) => {
                const operation = await page.evaluateHandle(createRemoveEventDelegate);

                const calls = await page.evaluateHandle((events) => {
                    const calls = { count: 0 };
                    $.addEventDelegate('div', events, 'a', () => {
                        calls.count++;
                    });
                    return calls;
                }, registeredEvents);

                await operation.evaluate((operation, args) => operation(...args), ['div', removedEvents, 'a']);

                const count = await calls.evaluate((calls, registeredEvents) => {
                    const events = registeredEvents.split(' ').map((event) =>
                        new Event(event.split('.')[0], { bubbles: true }));

                    for (const node of document.querySelectorAll('a')) {
                        for (const event of events) {
                            node.dispatchEvent(event);
                        }
                    }

                    return calls.count;
                }, registeredEvents);

                expect(count).toBe(expected);
            });
        }
    });

    test.describe('event types and handlers', () => {
        test('removes all delegated events from each node', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event1 = new Event('click', {
                    bubbles: true,
                });
                const event2 = new Event('hover', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', (_) => {
                    result++;
                });
                $.addEventDelegate('div', 'click hover', 'a', (_) => {
                    result++;
                });
                operation('div', null, 'a');
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event2);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event2);
                return result;
            }, operation)).toBe(0);
        });

        test('removes all delegated events of a type from each node', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event1 = new Event('click', {
                    bubbles: true,
                });
                const event2 = new Event('hover', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', (_) => {
                    result++;
                });
                $.addEventDelegate('div', 'click hover', 'a', (_) => {
                    result++;
                });
                operation('div', 'click', 'a');
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event2);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event2);
                return result;
            }, operation)).toBe(4);
        });

        test('removes all delegated events of types from each node', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event1 = new Event('click', {
                    bubbles: true,
                });
                const event2 = new Event('hover', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', (_) => {
                    result++;
                });
                $.addEventDelegate('div', 'click hover', 'a', (_) => {
                    result++;
                });
                operation('div', 'click hover', 'a');
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event2);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event2);
                return result;
            }, operation)).toBe(0);
        });

        test('removes a specific delegated event from each node', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', callback);
                $.addEventDelegate('div', 'click', 'a', (_) => {
                    result++;
                });
                operation('div', 'click', 'a', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            }, operation)).toBe(4);
        });

        test('does not remove a specific delegated event of the wrong type from each node', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', callback);
                $.addEventDelegate('div', 'click', 'a', (_) => {
                    result++;
                });
                operation('div', 'hover', 'a', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            }, operation)).toBe(8);
        });
    });

    test.describe('capture', () => {
        test('removes capture events', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event1 = new Event('click');
                const event2 = new Event('hover');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click hover', 'a', (_) => {
                    result++;
                }, true);
                operation('div', null, 'a');
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event2);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event2);
                return result;
            }, operation)).toBe(0);
        });

        test('works with capture', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEventDelegate);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event1 = new Event('click', {
                    bubbles: true,
                });
                const event2 = new Event('hover');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', (_) => {
                    result++;
                });
                $.addEventDelegate('div', 'hover', 'a', (_) => {
                    result++;
                }, { capture: true });
                operation('div', null, 'a', null, { capture: true });
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event2);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event2);
                return result;
            }, operation)).toBe(4);
        });
    });
}
