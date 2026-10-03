/** @import { Page } from '@playwright/test'; */

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
            '<div id="eventParent">' +
            '<div id="test1" data-toggle="event"></div>' +
            '<div id="test2" data-toggle="event"></div>' +
            '</div>' +
            '<div id="noEventParent">' +
            '<div id="test3" data-toggle="noEvent"></div>' +
            '<div id="test4" data-toggle="noEvent"></div>' +
            '</div>';
        $.addEvent('#test1', 'click', (event) => {
            event.currentTarget.dataset.test1 = 'Test 1';
        });
        $.addEvent('#test2', 'click', (event) => {
            event.currentTarget.dataset.test2 = 'Test 2';
        });
    });
};

/**
 * Registers shared cloneEvents behavior tests.
 * @param {((args: [string|Element, string|Element]) => void)} cloneEvents The browser callback for cloneEvents.
 */
export function cloneEventsTests(cloneEvents) {
    test('clones all events from all elements to all other elements', async ({ page }) => {
        await page.evaluate(cloneEvents, ['[data-toggle="event"]', '[data-toggle="noEvent"]']);

        expect(await page.evaluate(() => {
            const event = new Event('click');
            document.getElementById('test1').dispatchEvent(event);
            document.getElementById('test2').dispatchEvent(event);
            document.getElementById('test3').dispatchEvent(event);
            document.getElementById('test4').dispatchEvent(event);
            return document.body.innerHTML;
        })).toBe('<div id="eventParent">' +
            '<div id="test1" data-toggle="event" data-test1="Test 1"></div>' +
            '<div id="test2" data-toggle="event" data-test2="Test 2"></div>' +
            '</div>' +
            '<div id="noEventParent">' +
            '<div id="test3" data-toggle="noEvent" data-test1="Test 1" data-test2="Test 2"></div>' +
            '<div id="test4" data-toggle="noEvent" data-test1="Test 1" data-test2="Test 2"></div>' +
            '</div>');
    });

    test.describe('overlapping selections', () => {
        test('clones events to the source node once', async ({ page }) => {
            const element = await page.evaluateHandle(() => document.getElementById('test1'));
            const calls = await element.evaluateHandle((element) => {
                const calls = { count: 0 };
                $.removeEvent(element);
                $.addEvent(element, 'click', () => {
                    calls.count++;
                });
                return calls;
            });

            await page.evaluate(cloneEvents, [element, element]);

            const count = await calls.evaluate((calls, element) => {
                element.dispatchEvent(new Event('click'));
                return calls.count;
            }, element);

            expect(count).toBe(2);
        });

        test('clones only original events when source and destination nodes overlap', async ({ page }) => {
            const calls = await page.evaluateHandle(() => {
                const calls = { count: 0 };
                $.removeEvent('#test1, #test2');
                $.addEvent('#test1, #test2', 'click', () => {
                    calls.count++;
                });
                return calls;
            });

            await page.evaluate(cloneEvents, ['#test1, #test2', '#test2, #test3']);

            const count = await calls.evaluate((calls) => {
                const event = new Event('click');
                document.getElementById('test1').dispatchEvent(event);
                document.getElementById('test2').dispatchEvent(event);
                document.getElementById('test3').dispatchEvent(event);
                return calls.count;
            });

            expect(count).toBe(6);
        });
    });

    test.describe('capture', () => {
        test('clones capture events', async ({ page }) => {
            const calls = await page.evaluateHandle(() => {
                const calls = { count: 0 };
                $.removeEvent('#test1');
                $.removeEvent('#test2');
                $.addEvent('#eventParent', 'click', () => {
                    calls.count++;
                }, { capture: true });
                return calls;
            });

            await page.evaluate(cloneEvents, ['#eventParent', '#noEventParent']);

            const count = await calls.evaluate((calls) => {
                const event = new Event('click');
                document.getElementById('test1').dispatchEvent(event);
                document.getElementById('test2').dispatchEvent(event);
                document.getElementById('test3').dispatchEvent(event);
                document.getElementById('test4').dispatchEvent(event);
                return calls.count;
            });

            expect(count).toBe(4);
        });
    });
}
