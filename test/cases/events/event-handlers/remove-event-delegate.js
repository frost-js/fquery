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
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '<div id="parent2">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>';
    });
};

/**
 * Registers shared removeEventDelegate namespace behavior tests.
 * @param {((args: [string, string, string]) => void)} removeEventDelegate The browser callback for removeEventDelegate.
 */
export function removeEventDelegateTests(removeEventDelegate) {
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
                const calls = await page.evaluateHandle((events) => {
                    const calls = { count: 0 };
                    $.addEventDelegate('div', events, 'a', () => {
                        calls.count++;
                    });
                    return calls;
                }, registeredEvents);

                await page.evaluate(removeEventDelegate, ['div', removedEvents, 'a']);

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
}
