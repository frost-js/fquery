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
 * Registers shared triggerOne behavior tests.
 * @param {((args: [string|Array<string>, string]) => (boolean|undefined))} triggerOne The browser callback for triggerOne.
 */
export function triggerOneTests(triggerOne) {
    test.describe('empty selections', () => {
        test('returns undefined for an empty array', async ({ page }) => {
            expect(await page.evaluate(triggerOne, [[], 'click'])).toBe(undefined);
        });

        test('returns undefined for an unmatched selector', async ({ page }) => {
            expect(await page.evaluate(triggerOne, ['#invalid', 'click'])).toBe(undefined);
        });
    });

    test.describe('namespaces', () => {
        for (const [name, registeredEvents, triggeredEvent, expected] of [
            ['triggers a namespaced event for the first node', 'click.test', 'click', ['test1']],
            ['triggers a deep namespaced event for the first node', 'click.test.deep', 'click', ['test1']],
            ['triggers a namespaced event with namespacing for the first node', 'click.test', 'click.test', ['test1']],
            ['triggers a deep namespaced event with namespacing for the first node', 'click.test.deep', 'click.test', ['test1']],
            ['triggers a deep namespaced event with deep namespacing for the first node', 'click.test.deep', 'click.test.deep', ['test1']],
            ['does not trigger an event without namespacing for the first node', 'click', 'click.test', []],
            ['does not trigger a namespaced event with deep namespacing for the first node', 'click.test', 'click.test.deep', []],
        ]) {
            test(name, async ({ page }) => {
                const targets = await page.evaluateHandle((events) => {
                    const targets = [];
                    $.addEvent('a', events, (event) => {
                        targets.push(event.target.id);
                    });
                    return targets;
                }, registeredEvents);

                await page.evaluate(triggerOne, ['a', triggeredEvent]);

                expect(await targets.jsonValue()).toEqual(expected);
            });
        }
    });
}
