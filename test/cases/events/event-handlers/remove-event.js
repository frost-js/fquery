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
 * Registers shared removeEvent namespace behavior tests.
 * @param {((args: [string, string]) => void)} removeEvent The browser callback for removeEvent.
 */
export function removeEventTests(removeEvent) {
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
                const calls = await page.evaluateHandle((events) => {
                    const calls = { count: 0 };
                    $.addEvent('a', events, () => {
                        calls.count++;
                    });
                    return calls;
                }, registeredEvents);

                await page.evaluate(removeEvent, ['a', removedEvents]);

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
}
