/** @import { Page } from '@playwright/test'; */
/** @import { remove } from '../../../../src/manipulation/manipulation.js'; */

import { expect, test } from '#test';
import { advanceClock, setupClock } from '../../../setup/browser.js';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML =
            '<div id="outer1">' +
            '<div id="inner1">' +
            '<a href="#" id="test1">Test</a>' +
            '<a href="#" id="test2">Test</a>' +
            '</div>' +
            '</div>' +
            '<div id="outer2">' +
            '<div id="inner2">' +
            '<a href="#" id="test3">Test</a>' +
            '<a href="#" id="test4">Test</a>' +
            '</div>' +
            '</div>';
    });
};

/**
 * Registers shared remove behavior tests.
 * @param {() => typeof remove} createRemove Creates the browser-side method adapter.
 */
export function removeTests(createRemove) {
    test('removes all nodes from the DOM', async ({ page }) => {
        const operation = await page.evaluateHandle(createRemove);

        await operation.evaluate((operation, args) => operation(...args), ['a']);

        await expect(page.locator('a')).toHaveCount(0);
        await expect(page.locator('#inner1')).toHaveCount(1);
        await expect(page.locator('#inner2')).toHaveCount(1);
        await expect(page.locator('#inner1').locator(':scope > *')).toHaveCount(0);
        await expect(page.locator('#inner2').locator(':scope > *')).toHaveCount(0);
    });

    test.describe('cleanup', () => {
        test('removes events', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemove);

            const clickCount = await page.evaluate((operation) => {
                let count = 0;
                const nodes = [...document.querySelectorAll('a')];

                $.addEvent('a', 'click', () => {
                    count++;
                });

                operation('a');

                for (const node of nodes) {
                    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                }

                return count;
            }, operation);

            expect(clickCount).toBe(0);
        });

        test('removes events recursively', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemove);

            const clickCount = await page.evaluate((operation) => {
                let count = 0;
                const nodes = [...document.querySelectorAll('a')];

                $.addEvent('a', 'click', () => {
                    count++;
                });

                operation('div');

                for (const node of nodes) {
                    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                }

                return count;
            }, operation);

            expect(clickCount).toBe(0);
        });

        test('removes data', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemove);

            const values = await page.evaluate((operation) => {
                const nodes = [...document.querySelectorAll('a')];

                $.setData('a', 'test', 'Test');
                operation('a');

                return nodes.map((node) => $.getData(node, 'test'));
            }, operation);

            expect(values).toEqual([
                undefined,
                undefined,
                undefined,
                undefined,
            ]);
        });

        test('removes descendant data when a form control shadows children', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemove);

            const value = await page.evaluate((operation) => {
                document.body.innerHTML =
                    '<form>' +
                    '<input name="children">' +
                    '<span id="test">Test</span>' +
                    '</form>';
                const child = document.getElementById('test');
                $.setData(child, 'test', 'Test');

                operation('form');

                return $.getData(child, 'test');
            }, operation);

            expect(value).toBeUndefined();
        });

        test('removes descendant data when a form control shadows shadowRoot', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemove);

            const value = await page.evaluate((operation) => {
                document.body.innerHTML =
                    '<form>' +
                    '<input name="shadowRoot">' +
                    '<span id="test">Test</span>' +
                    '</form>';
                const child = document.getElementById('test');
                $.setData(child, 'test', 'Test');

                operation('form');

                return $.getData(child, 'test');
            }, operation);

            expect(value).toBeUndefined();
        });

        test('removes data recursively', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemove);

            const values = await page.evaluate((operation) => {
                const nodes = [...document.querySelectorAll('a')];

                $.setData('a', 'test', 'Test');
                operation('div');

                return nodes.map((node) => $.getData(node, 'test'));
            }, operation);

            expect(values).toEqual([
                undefined,
                undefined,
                undefined,
                undefined,
            ]);
        });

        test('removes animations', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemove);

            await setupClock(page);

            await page.evaluate(() => {
                $.animate(
                    'a',
                    () => {},
                    {
                        duration: 100,
                        debug: true,
                    },
                );
            });

            await advanceClock(page, 20);

            expect(await page.evaluate(() =>
                [...document.querySelectorAll('a')].length === 4 &&
                [...document.querySelectorAll('a')].every((node) => Boolean(node.dataset.animationProgress)),
            )).toBe(true);

            await page.evaluate((operation) => {
                const nodes = [...document.querySelectorAll('a')];

                operation('a');

                for (const node of nodes) {
                    document.body.appendChild(node);
                }
            }, operation);

            expect(await page.evaluate(() =>
                [...document.querySelectorAll('body > a')].every((node) =>
                    !node.dataset.animationProgress &&
                    !node.dataset.animationStart &&
                    !node.dataset.animationTime),
            )).toBe(true);
        });

        test('removes animations recursively', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemove);

            await setupClock(page);

            await page.evaluate(() => {
                $.animate(
                    'a',
                    () => {},
                    {
                        duration: 100,
                        debug: true,
                    },
                );
            });

            await advanceClock(page, 20);

            expect(await page.evaluate(() =>
                [...document.querySelectorAll('a')].length === 4 &&
                [...document.querySelectorAll('a')].every((node) => Boolean(node.dataset.animationProgress)),
            )).toBe(true);

            await page.evaluate((operation) => {
                const nodes = [...document.querySelectorAll('a')];

                operation('div');

                for (const node of nodes) {
                    document.body.appendChild(node);
                }
            }, operation);

            expect(await page.evaluate(() =>
                [...document.querySelectorAll('body > a')].every((node) =>
                    !node.dataset.animationProgress &&
                    !node.dataset.animationStart &&
                    !node.dataset.animationTime),
            )).toBe(true);
        });

        test('removes queue', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemove);

            await setupClock(page);

            await page.evaluate(() => {
                document.documentElement.removeAttribute('data-queue-checkpoint');

                setTimeout(() => {
                    document.documentElement.setAttribute('data-queue-checkpoint', 'done');
                }, 110);

                $.queue('a', (node) => {
                    node.dataset.queueState = 'running';

                    return new Promise((resolve) => {
                        setTimeout(resolve, 100);
                    });
                });
                $.queue('a', (node) => {
                    node.dataset.test = 'Test';
                });
            });

            await advanceClock(page, 10);
            await expect.poll(async () => await page.locator('#test1').getAttribute('data-queue-state')).toBe('running');

            await page.evaluate((operation) => {
                const nodes = [...document.querySelectorAll('a')];

                operation('a');

                for (const node of nodes) {
                    document.body.appendChild(node);
                }
            }, operation);

            await advanceClock(page, 120);
            await expect(page.locator('html')).toHaveAttribute('data-queue-checkpoint', 'done');
            expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();
        });

        test('removes queue recursively', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemove);

            await setupClock(page);

            await page.evaluate(() => {
                document.documentElement.removeAttribute('data-queue-checkpoint');

                setTimeout(() => {
                    document.documentElement.setAttribute('data-queue-checkpoint', 'done');
                }, 110);

                $.queue('a', (node) => {
                    node.dataset.queueState = 'running';

                    return new Promise((resolve) => {
                        setTimeout(resolve, 100);
                    });
                });
                $.queue('a', (node) => {
                    node.dataset.test = 'Test';
                });
            });

            await advanceClock(page, 10);
            await expect.poll(async () => await page.locator('#test1').getAttribute('data-queue-state')).toBe('running');

            await page.evaluate((operation) => {
                const nodes = [...document.querySelectorAll('a')];

                operation('div');

                for (const node of nodes) {
                    document.body.appendChild(node);
                }
            }, operation);

            await advanceClock(page, 120);
            await expect(page.locator('html')).toHaveAttribute('data-queue-checkpoint', 'done');
            expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();
        });
    });

    test.describe('removal events', () => {
        test('triggers a remove event', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemove);

            const removeCount = await page.evaluate((operation) => {
                let count = 0;

                $.addEvent('a', 'remove', () => {
                    count++;
                });

                operation('a');

                return count;
            }, operation);

            expect(removeCount).toBe(4);
        });

        test('triggers a remove event recursively', async ({ page }) => {
            const operation = await page.evaluateHandle(createRemove);

            const removeCount = await page.evaluate((operation) => {
                let count = 0;

                $.addEvent('a', 'remove', () => {
                    count++;
                });

                operation('div');

                return count;
            }, operation);

            expect(removeCount).toBe(4);
        });
    });
}
