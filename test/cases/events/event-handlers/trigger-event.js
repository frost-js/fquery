/** @import { Page } from '@playwright/test'; */
/** @import { TriggerEventOptions } from '../../../../src/events/event-handlers.js'; */

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
            '<div id="div1">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>';
    });
};

/**
 * Registers shared triggerEvent behavior tests.
 * @param {((args: [string, string, TriggerEventOptions?]) => void)} triggerEvent The browser callback for triggerEvent.
 */
export function triggerEventTests(triggerEvent) {
    test('triggers an event for each node', async ({ page }) => {
        const calls = await page.evaluateHandle(() => {
            const calls = { count: 0 };
            $.addEvent('a', 'click', () => {
                calls.count++;
            });
            return calls;
        });

        await page.evaluate(triggerEvent, ['a', 'click']);

        expect(await calls.evaluate((calls) => calls.count)).toBe(2);
    });

    test('triggers events for each node', async ({ page }) => {
        const calls = await page.evaluateHandle(() => {
            const calls = { count: 0 };
            $.addEvent('a', 'click', () => {
                calls.count++;
            });
            $.addEvent('a', 'hover', () => {
                calls.count++;
            });
            return calls;
        });

        await page.evaluate(triggerEvent, ['a', 'click hover']);

        expect(await calls.evaluate((calls) => calls.count)).toBe(4);
    });

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

    test.describe('event properties', () => {
        test('triggers an event for each node with custom data', async ({ page }) => {
            const calls = await page.evaluateHandle(() => {
                const calls = { count: 0 };
                $.addEvent('a', 'click', (event) => {
                    if (event.test) {
                        calls.count++;
                    }
                });
                return calls;
            });

            await page.evaluate(triggerEvent, ['a', 'click']);
            await page.evaluate(triggerEvent, ['a', 'click', {
                data: {
                    test: true,
                },
            }]);

            expect(await calls.evaluate((calls) => calls.count)).toBe(2);
        });

        test('triggers an event for each node with custom details', async ({ page }) => {
            const calls = await page.evaluateHandle(() => {
                const calls = { count: 0 };
                $.addEvent('a', 'click', (event) => {
                    if (event.detail === 'test') {
                        calls.count++;
                    }
                });
                return calls;
            });

            await page.evaluate(triggerEvent, ['a', 'click']);
            await page.evaluate(triggerEvent, ['a', 'click', {
                detail: 'test',
            }]);

            expect(await calls.evaluate((calls) => calls.count)).toBe(2);
        });
    });

    test.describe('propagation', () => {
        test('bubbles to other event listeners', async ({ page }) => {
            const calls = await page.evaluateHandle(() => {
                const calls = { count: 0 };
                $.addEvent('#div1', 'click', () => {
                    calls.count++;
                });
                return calls;
            });

            await page.evaluate(triggerEvent, ['a', 'click']);

            expect(await calls.evaluate((calls) => calls.count)).toBe(2);
        });

        test('can be prevented from bubbling', async ({ page }) => {
            const calls = await page.evaluateHandle(() => {
                const calls = { count: 0 };
                $.addEvent('#div1', 'click', () => {
                    calls.count++;
                });
                return calls;
            });

            await page.evaluate(triggerEvent, ['a', 'click', {
                bubbles: false,
            }]);

            expect(await calls.evaluate((calls) => calls.count)).toBe(0);
        });
    });

    test.describe('cancellation', () => {
        test('can be cancelled', async ({ page }) => {
            const state = await page.evaluateHandle(() => {
                const state = { value: undefined };
                $.addEvent('#test1', 'click', (event) => {
                    state.value = event.cancelable;
                });
                return state;
            });

            await page.evaluate(triggerEvent, ['#test1', 'click']);

            expect(await state.evaluate((state) => state.value)).toBe(true);
        });

        test('does not carry cancellation between nodes', async ({ page }) => {
            const state = await page.evaluateHandle(() => {
                const state = { value: undefined };
                $.addEvent('#test1', 'click', (event) => {
                    event.preventDefault();
                });
                $.addEvent('#test2', 'click', (event) => {
                    state.value = event.defaultPrevented;
                });
                return state;
            });

            await page.evaluate(triggerEvent, ['a', 'click']);

            expect(await state.evaluate((state) => state.value)).toBe(false);
        });

        test('can be prevented from being cancelled', async ({ page }) => {
            const state = await page.evaluateHandle(() => {
                const state = { value: undefined };
                $.addEvent('#test1', 'click', (event) => {
                    state.value = event.cancelable;
                });
                return state;
            });

            await page.evaluate(triggerEvent, ['#test1', 'click', {
                cancelable: false,
            }]);

            expect(await state.evaluate((state) => state.value)).toBe(false);
        });
    });
}
