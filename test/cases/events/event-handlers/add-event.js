/** @import { Page } from '@playwright/test'; */
/** @import { addEvent } from '../../../../src/events/event-handlers.js'; */

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
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>';
    });
};

/**
 * Registers shared addEvent behavior tests.
 * @param {() => typeof addEvent} createAddEvent Creates the browser-side method adapter.
 */
export function addEventTests(createAddEvent) {
    for (const [group, cases] of [
        ['registration', [
            ['adds an event to each node', 'click', ['click'], 4],
            ['adds events to each node', 'click hover', ['click', 'hover'], 8],
        ]],
        ['namespaces', [
            ['adds a namespaced event to each node', 'click.test', ['click'], 4],
            ['adds namespaced events to each node', 'click.test hover.test', ['click', 'hover'], 8],
            ['adds a deep namespaced event to each node', 'click.test.deep', ['click'], 4],
            ['adds deep namespaced events to each node', 'click.test.deep hover.test.deep', ['click', 'hover'], 8],
        ]],
    ]) {
        test.describe(group, () => {
            for (const [name, registeredEvents, eventTypes, expected] of cases) {
                test(name, async ({ page }) => {
                    const operation = await page.evaluateHandle(createAddEvent);

                    const calls = await page.evaluateHandle(() => ({ count: 0 }));
                    const args = await page.evaluateHandle(({ calls, events }) => [
                        'a', events,
                        () => {
                            calls.count++;
                        },
                    ], { calls, events: registeredEvents });

                    await operation.evaluate((operation, args) => operation(...args), args);

                    const count = await calls.evaluate((calls, eventTypes) => {
                        const events = eventTypes.map((type) => new Event(type));

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

    test.describe('event names', () => {
        for (const eventName of ['constructor', 'toString', '__proto__']) {
            test(`adds events named ${eventName}`, async ({ page }) => {
                const operation = await page.evaluateHandle(createAddEvent);

                const calls = await page.evaluateHandle(() => ({ count: 0 }));
                const args = await page.evaluateHandle(({ calls, eventName }) => [
                    'a', eventName,
                    () => {
                        calls.count++;
                    },
                ], { calls, eventName });

                await operation.evaluate((operation, args) => operation(...args), args);

                const count = await calls.evaluate((calls, eventName) => {
                    const event = new Event(eventName);
                    document.getElementById('test1').dispatchEvent(event);
                    document.getElementById('test2').dispatchEvent(event);
                    return calls.count;
                }, eventName);

                expect(count).toBe(2);
            });
        }
    });

    test.describe('capture', () => {
        test('does not capture events', async ({ page }) => {
            const operation = await page.evaluateHandle(createAddEvent);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                operation(document, 'click', () => {
                    result++;
                });
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            }, operation)).toBe(0);
        });

        test('works with capture', async ({ page }) => {
            const operation = await page.evaluateHandle(createAddEvent);

            expect(await page.evaluate((operation) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                operation(document, 'click', () => {
                    result++;
                }, { capture: true });
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            }, operation)).toBe(4);
        });
    });
}
