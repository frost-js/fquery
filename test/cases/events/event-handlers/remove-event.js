/** @import { Page } from '@playwright/test'; */
/** @import { removeEvent } from '../../../../src/events/event-handlers.js'; */

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
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>';
    });
};

/**
 * Registers shared removeEvent behavior tests.
 * @param {() => typeof removeEvent} createRemoveEvent Creates the browser-side method adapter.
 */
export function removeEventTests(createRemoveEvent) {
    test.describe('namespaces', () => {
        for (const [name, registeredEvents, removedEvents, expected] of [
            ['removes a namespaced event from each node', 'click.test', 'click', 0],
            ['removes namespaced events from each node', 'click.test hover.test', 'click hover', 0],
            ['removes a deep namespaced event from each node', 'click.test.deep', 'click', 0],
            ['removes deep namespaced events from each node', 'click.test.deep hover.test.deep', 'click hover', 0],
            ['removes a namespaced event with namespacing from each node', 'click.test', 'click.test', 0],
            ['removes namespaced events with namespacing from each node', 'click.test hover.test', 'click.test hover.test', 0],
            ['removes a deep namespaced event with namespacing from each node', 'click.test.deep', 'click.test', 0],
            ['removes deep namespaced events with namespacing from each node', 'click.test.deep hover.test.deep', 'click.test hover.test', 0],
            ['removes a deep namespaced event with deep namespacing from each node', 'click.test.deep', 'click.test.deep', 0],
            ['removes deep namespaced events with deep namespacing from each node', 'click.test.deep hover.test.deep', 'click.test.deep hover.test.deep', 0],
            ['does not remove an event without namespacing from each node', 'click', 'click.test', 2],
            ['does not remove events without namespacing from each node', 'click hover', 'click.test hover.test', 4],
            ['does not remove a namespaced event with deep namespacing from each node', 'click.test', 'click.test.deep', 2],
            ['does not remove namespaced events with deep namespacing from each node', 'click.test hover.test', 'click.test.deep hover.test.deep', 4],
        ]) {
            test(name, async ({ page }) => {
                const operation = await page.evaluateHandle(createRemoveEvent);

                const calls = await page.evaluateHandle((events) => {
                    const calls = { count: 0 };
                    $.addEvent('a', events, () => {
                        calls.count++;
                    });
                    return calls;
                }, registeredEvents);

                await operation.evaluate((operation, args) => operation(...args), ['a', removedEvents]);

                const count = await calls.evaluate((calls, registeredEvents) => {
                    const events = registeredEvents.split(' ').map((event) =>
                        new Event(event.split('.')[0]));

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
        test('removes all events from each node', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEvent);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event1 = new Event('click');
                const event2 = new Event('hover');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent('a', 'click hover', (_) => {
                    result++;
                });
                operation('a');
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                return result;
            }, operation)).toBe(0);
        });

        test('removes all events of a type from each node', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEvent);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event1 = new Event('click');
                const event2 = new Event('hover');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent('a', 'click', (_) => {
                    result++;
                });
                $.addEvent('a', 'click hover', (_) => {
                    result++;
                });
                operation('a', 'click');
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                return result;
            }, operation)).toBe(2);
        });

        test('removes all events of types from each node', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEvent);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event1 = new Event('click');
                const event2 = new Event('hover');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent('a', 'click', (_) => {
                    result++;
                });
                $.addEvent('a', 'click hover', (_) => {
                    result++;
                });
                operation('a', 'click hover');
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                return result;
            }, operation)).toBe(0);
        });

        test('removes a specific event from each node', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEvent);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent('a', 'click', callback);
                $.addEvent('a', 'click', (_) => {
                    result++;
                });
                operation('a', 'click', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            }, operation)).toBe(2);
        });

        test('does not remove a specific event of the wrong type from each node', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEvent);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent('a', 'click', callback);
                $.addEvent('a', 'click', (_) => {
                    result++;
                });
                operation('a', 'hover', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            }, operation)).toBe(4);
        });

        for (const eventName of ['constructor', 'toString', '__proto__']) {
            test(`removes events named ${eventName}`, async ({ page }) => {
                const operation = await page.evaluateHandle(createRemoveEvent);

                expect(await page.evaluate(([operation, eventName]) => {
                    let result = 0;
                    const event = new Event(eventName);
                    const element1 = document.getElementById('test1');
                    const element2 = document.getElementById('test2');
                    $.addEvent('a', eventName, (_) => {
                        result++;
                    });
                    $.addEvent('a', 'click', (_) => null);
                    operation('a', eventName);
                    element1.dispatchEvent(event);
                    element2.dispatchEvent(event);
                    return result;
                }, [operation, eventName])).toBe(0);
            });

            test(`preserves other events when removing events named ${eventName}`, async ({ page }) => {
                const operation = await page.evaluateHandle(createRemoveEvent);

                expect(await page.evaluate(([operation, eventName]) => {
                    let result = 0;
                    const event = new Event('click');
                    const element1 = document.getElementById('test1');
                    const element2 = document.getElementById('test2');
                    $.addEvent('a', 'click', (_) => {
                        result++;
                    });
                    $.addEvent('a', eventName, (_) => null);
                    operation('a', eventName);
                    element1.dispatchEvent(event);
                    element2.dispatchEvent(event);
                    return result;
                }, [operation, eventName])).toBe(2);
            });
        }
    });

    test.describe('cloning after removal', () => {
        test('does not restore removed handlers when cloning nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEvent);

            expect(await page.evaluate((operation) => {
                let removedCount = 0;
                const callback = (_) => {
                    removedCount++;
                };

                $.addEvent('a', 'click', callback);
                $.addEvent('a', 'click', (_) => null);
                operation('a', 'click', callback);

                const clones = $.clone('a', { events: true });
                $.triggerEvent(clones, 'click');

                return removedCount;
            }, operation)).toBe(0);
        });

        test('preserves remaining handlers when cloning after removal', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEvent);

            expect(await page.evaluate((operation) => {
                let remainingCount = 0;
                const callback = (_) => null;

                $.addEvent('a', 'click', callback);
                $.addEvent('a', 'click', (_) => {
                    remainingCount++;
                });
                operation('a', 'click', callback);

                const clones = $.clone('a', { events: true });
                $.triggerEvent(clones, 'click');

                return remainingCount;
            }, operation)).toBe(2);
        });
    });

    test.describe('capture', () => {
        test('removes capture events', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEvent);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event1 = new Event('click');
                const event2 = new Event('hover');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent(document, 'click hover', (_) => {
                    result++;
                }, true);
                operation(document);
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                return result;
            }, operation)).toBe(0);
        });

        test('works with capture', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemoveEvent);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event1 = new Event('click', {
                    bubbles: true,
                });
                const event2 = new Event('hover');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent(document, 'click', (_) => {
                    result++;
                });
                $.addEvent(document, 'hover', (_) => {
                    result++;
                }, { capture: true });
                operation(document, null, null, { capture: true });
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                return result;
            }, operation)).toBe(2);
        });
    });
}
