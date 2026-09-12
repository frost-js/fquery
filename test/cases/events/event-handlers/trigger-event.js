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
            '<div id="div1">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>';
    });
};

/**
 * Registers shared triggerEvent namespace behavior tests.
 * @param {((args: [string, string]) => void)} triggerEvent The browser callback for triggerEvent.
 */
export function triggerEventTests(triggerEvent) {
    test.describe('namespaces', () => {
        for (const [name, registeredEvents, triggeredEvents, expected] of [
            ['triggers a namespaced event for each node', 'click.test', 'click', 2],
            ['triggers namespaced events for each node', 'click.test hover.test', 'click hover', 4],
            ['triggers a deep namespaced event for each node', 'click.test.deep', 'click', 2],
            ['triggers deep namespaced events for each node', 'click.test.deep hover.test.deep', 'click hover', 4],
            ['triggers a namespaced event with namespacing for each node', 'click.test', 'click.test', 2],
            ['triggers namespaced events with namespacing for each node', 'click.test hover.test', 'click.test hover.test', 4],
            ['triggers a deep namespaced event with namespacing for each node', 'click.test.deep', 'click.test', 2],
            ['triggers deep namespaced events with namespacing for each node', 'click.test.deep hover.test.deep', 'click.test hover.test', 4],
            ['triggers a deep namespaced event with deep namespacing for each node', 'click.test.deep', 'click.test.deep', 2],
            ['triggers deep namespaced events with deep namespacing for each node', 'click.test.deep hover.test.deep', 'click.test.deep hover.test.deep', 4],
            ['does not trigger an event without namespacing for each node', 'click', 'click.test', 0],
            ['does not trigger events without namespacing for each node', 'click hover', 'click.test hover.test', 0],
            ['does not trigger a namespaced event with deep namespacing for each node', 'click.test', 'click.test.deep', 0],
            ['does not trigger namespaced events with deep namespacing for each node', 'click.test hover.test', 'click.test.deep hover.test.deep', 0],
        ]) {
            test(name, async ({ page }) => {
                const calls = await page.evaluateHandle((events) => {
                    const calls = { count: 0 };
                    $.addEvent('a', events, () => {
                        calls.count++;
                    });
                    return calls;
                }, registeredEvents);

                await page.evaluate(triggerEvent, ['a', triggeredEvents]);

                expect(await calls.evaluate((calls) => calls.count)).toBe(expected);
            });
        }
    });
}
