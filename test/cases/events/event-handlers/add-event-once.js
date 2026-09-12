/** @import { Page } from '@playwright/test'; */

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
 * Registers shared addEventOnce registration and namespace tests.
 * @param {((args: [string, string, EventListener]) => void)} addEventOnce The browser callback for addEventOnce.
 */
export function addEventOnceTests(addEventOnce) {
    for (const [group, cases] of [
        ['registration', [
            ['adds a self-destructing event to each node', 'click', ['click'], 2],
            ['adds self-destructing events to each node', 'click hover', ['click', 'hover'], 4],
        ]],
        ['namespaces', [
            ['adds a namespaced self-destructing event to each node', 'click.test', ['click'], 2],
            ['adds namespaced self-destructing events to each node', 'click.test hover.test', ['click', 'hover'], 4],
            ['adds a deep namespaced self-destructing event to each node', 'click.test.deep', ['click'], 2],
            ['adds deep namespaced self-destructing events to each node', 'click.test.deep hover.test.deep', ['click', 'hover'], 4],
        ]],
    ]) {
        test.describe(group, () => {
            for (const [name, registeredEvents, eventTypes, expected] of cases) {
                test(name, async ({ page }) => {
                    const calls = await page.evaluateHandle(() => ({ count: 0 }));
                    const args = await page.evaluateHandle(({ calls, events }) => [
                        'a', events,
                        () => {
                            calls.count++;
                        },
                    ], { calls, events: registeredEvents });

                    await page.evaluate(addEventOnce, args);

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
}
