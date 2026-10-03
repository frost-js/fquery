/** @import { Page } from '@playwright/test'; */
/** @import { addEventDelegateOnce } from '../../../../src/events/event-handlers.js'; */

import { expect, test } from '#test';

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
 * Registers shared addEventDelegateOnce behavior tests.
 * @param {() => typeof addEventDelegateOnce} createAddEventDelegateOnce Creates the browser-side method adapter.
 */
export function addEventDelegateOnceTests(createAddEventDelegateOnce) {
    for (const [group, cases] of [
        ['registration', [
            ['adds a self-destructing delegated event to each node', 'click', ['click'], 2],
            ['adds self-destructing delegated events to each node', 'click hover', ['click', 'hover'], 4],
        ]],
        ['namespaces', [
            ['adds a namespaced self-destructing delegated event to each node', 'click.test', ['click'], 2],
            ['adds namespaced self-destructing delegated events to each node', 'click.test hover.test', ['click', 'hover'], 4],
            ['adds a deep namespaced self-destructing delegated event to each node', 'click.test.deep', ['click'], 2],
            ['adds deep namespaced self-destructing delegated events to each node', 'click.test.deep hover.test.deep', ['click', 'hover'], 4],
        ]],
    ]) {
        test.describe(group, () => {
            for (const [name, registeredEvents, eventTypes, expected] of cases) {
                test(name, async ({ page }) => {
                    const operation = await page.evaluateHandle(createAddEventDelegateOnce);

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

    test.describe('handler lifecycle', () => {
        test('preserves persistent delegated handlers with the same callback', async ({ page }) => {
            const operation = await page.evaluateHandle(createAddEventDelegateOnce);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test3');
                const callback = () => {
                    result++;
                };
                $.addEventDelegate('div', 'click', 'a', callback);
                operation('div', 'click', 'a', callback);
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            }, operation)).toBe(6);
        });
    });

    test.describe('capture', () => {
        test('does not capture events', async ({ page }) => {
            const operation = await page.evaluateHandle(createAddEventDelegateOnce);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                operation('div', 'click', 'a', () => {
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
            const operation = await page.evaluateHandle(createAddEventDelegateOnce);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                operation('div', 'click', 'a', () => {
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
            }, operation)).toBe(2);
        });
    });
}
