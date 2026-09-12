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
 * @param {((args: [string|Array<string>, string, TriggerEventOptions?]) => (boolean|undefined))} triggerOne The browser callback for triggerOne.
 */
export function triggerOneTests(triggerOne) {
    test('triggers an event for the first node', async ({ page }) => {
        const targets = await page.evaluateHandle((_) => {
            const targets = [];
            $.addEvent('a', 'click', (e) => {
                targets.push(e.target.id);
            });
            return targets;
        });

        await page.evaluate(triggerOne, ['a', 'click']);

        expect(await targets.jsonValue()).toEqual(['test1']);
    });

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

    test.describe('event properties', () => {
        test('triggers an event for the first node with custom data', async ({ page }) => {
            const targets = await page.evaluateHandle((_) => {
                const targets = [];
                $.addEvent('a', 'click', (e) => {
                    if (e.test) {
                        targets.push(e.target.id);
                    }
                });
                return targets;
            });

            await page.evaluate(triggerOne, ['a', 'click']);
            await page.evaluate(triggerOne, ['a', 'click', {
                data: {
                    test: true,
                },
            }]);

            expect(await targets.jsonValue()).toEqual(['test1']);
        });

        test('triggers an event for the first node with custom details', async ({ page }) => {
            const targets = await page.evaluateHandle((_) => {
                const targets = [];
                $.addEvent('a', 'click', (e) => {
                    if (e.detail === 'test') {
                        targets.push(e.target.id);
                    }
                });
                return targets;
            });

            await page.evaluate(triggerOne, ['a', 'click']);
            await page.evaluate(triggerOne, ['a', 'click', {
                detail: 'test',
            }]);

            expect(await targets.jsonValue()).toEqual(['test1']);
        });
    });

    test.describe('propagation', () => {
        test('bubbles to other event listeners', async ({ page }) => {
            const calls = await page.evaluateHandle((_) => {
                const calls = { count: 0 };
                $.addEvent('#div1', 'click', (_) => {
                    calls.count++;
                });
                return calls;
            });

            await page.evaluate(triggerOne, ['a', 'click']);

            expect(await calls.evaluate((calls) => calls.count)).toBe(1);
        });

        test('can be prevented from bubbling', async ({ page }) => {
            const calls = await page.evaluateHandle((_) => {
                const calls = { count: 0 };
                $.addEvent('#div1', 'click', (_) => {
                    calls.count++;
                });
                return calls;
            });

            await page.evaluate(triggerOne, ['a', 'click', {
                bubbles: false,
            }]);

            expect(await calls.evaluate((calls) => calls.count)).toBe(0);
        });
    });

    test.describe('cancellation', () => {
        test('returns false if the event is cancelled', async ({ page }) => {
            await page.evaluate((_) => {
                $.addEvent('#test1', 'click', (e) => {
                    e.preventDefault();
                });
            });

            expect(await page.evaluate(triggerOne, ['#test1', 'click'])).toBe(false);
        });

        test('returns false if the event returns false', async ({ page }) => {
            await page.evaluate((_) => {
                $.addEvent('#test1', 'click', (_) => false);
            });

            expect(await page.evaluate(triggerOne, ['#test1', 'click'])).toBe(false);
        });

        test('returns false if a delegated event returns false', async ({ page }) => {
            await page.evaluate((_) => {
                $.addEventDelegate('#div1', 'click', 'a', (_) => false);
            });

            expect(await page.evaluate(triggerOne, ['#test1', 'click'])).toBe(false);
        });

        test('returns true if the event is not cancelled', async ({ page }) => {
            await page.evaluate((_) => {
                $.addEvent('#test1', 'click', (_) => { });
            });

            expect(await page.evaluate(triggerOne, ['#test1', 'click'])).toBe(true);
        });

        test('returns true if a delegated event is not cancelled', async ({ page }) => {
            await page.evaluate((_) => {
                $.addEventDelegate('#div1', 'click', 'a', (_) => { });
            });

            expect(await page.evaluate(triggerOne, ['#test1', 'click'])).toBe(true);
        });

        test('can be prevented from being cancelled', async ({ page }) => {
            await page.evaluate((_) => {
                $.addEvent('#test1', 'click', (e) => {
                    e.preventDefault();
                });
            });

            expect(await page.evaluate(triggerOne, ['#test1', 'click', {
                cancelable: false,
            }])).toBe(true);
        });

        test('can be prevented from being cancelled with delegate', async ({ page }) => {
            await page.evaluate((_) => {
                $.addEventDelegate('#div1', 'click', 'a', (e) => {
                    e.preventDefault();
                });
            });

            expect(await page.evaluate(triggerOne, ['#test1', 'click', {
                cancelable: false,
            }])).toBe(true);
        });
    });
}
