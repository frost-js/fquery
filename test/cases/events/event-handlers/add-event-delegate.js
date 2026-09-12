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
 * Registers shared addEventDelegate registration and namespace tests.
 * @param {((args: [string, string, string, EventListener]) => void)} addEventDelegate The browser callback for addEventDelegate.
 */
export function addEventDelegateTests(addEventDelegate) {
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
                    const calls = await page.evaluateHandle(() => ({ count: 0 }));
                    const args = await page.evaluateHandle(({ calls, events }) => [
                        'div', events, 'a',
                        () => {
                            calls.count++;
                        },
                    ], { calls, events: registeredEvents });

                    await page.evaluate(addEventDelegate, args);

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
}
