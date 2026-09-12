/** @import { Page } from '@playwright/test'; */
/** @import { empty } from '../../../../src/manipulation/manipulation.js'; */

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
 * Registers shared empty behavior tests.
 * @param {() => typeof empty} createEmpty Creates the browser-side method adapter.
 */
export function emptyTests(createEmpty) {
    test('removes contents of all nodes from the DOM', async ({ page }) => {
        const operation = await page.evaluateHandle(createEmpty);

        await operation.evaluate((operation, args) => operation(...args), ['div']);

        await expect(page.locator('body > div')).toHaveCount(2);
        await expect(page.locator('#outer1 > *')).toHaveCount(0);
        await expect(page.locator('#outer2 > *')).toHaveCount(0);
        await expect(page.locator('a')).toHaveCount(0);
    });

    test.describe('cleanup', () => {
        test('removes events recursively', async ({ page }) => {
            const operation = await page.evaluateHandle(createEmpty);

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

        test('removes data recursively', async ({ page }) => {
            const operation = await page.evaluateHandle(createEmpty);

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

        test('removes animations recursively', async ({ page }) => {
            const operation = await page.evaluateHandle(createEmpty);

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

            await expect.poll(async () => await page.evaluate(() =>
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

            await expect.poll(async () => await page.evaluate(() =>
                [...document.querySelectorAll('body > a')].every((node) =>
                    !node.dataset.animationProgress &&
                    !node.dataset.animationStart &&
                    !node.dataset.animationTime),
            )).toBe(true);
        });

        test('removes queue recursively', async ({ page }) => {
            const operation = await page.evaluateHandle(createEmpty);

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

    test.describe('shadow and template contents', () => {
        test('preserves events in the host shadow root', async ({ page }) => {
            const operation = await page.evaluateHandle(createEmpty);

            const clickCount = await page.evaluate((operation) => {
                let count = 0;
                const node = document.getElementById('test1');
                const shadow = document.getElementById('outer1').attachShadow({ mode: 'open' });
                shadow.appendChild(node);

                $.addEvent([shadow, node], 'click', () => {
                    count++;
                });

                operation('#outer1');
                $.triggerEvent(node, 'click');

                return count;
            }, operation);

            expect(clickCount).toBe(2);
            await expect(page.locator('#test1')).toHaveText('Test');
            await expect(page.locator('#inner1')).toHaveCount(0);
        });

        test('preserves events inside template contents', async ({ page }) => {
            const operation = await page.evaluateHandle(createEmpty);

            const clickCount = await page.evaluate((operation) => {
                let count = 0;
                const node = document.getElementById('test1');
                const template = document.createElement('template');
                template.content.appendChild(node);
                template.appendChild(document.getElementById('outer1'));
                document.body.appendChild(template);

                $.addEvent(node, 'click', () => {
                    count++;
                });

                operation(template);
                document.body.appendChild(template.content);
                $.triggerEvent(node, 'click');

                return count;
            }, operation);

            expect(clickCount).toBe(1);
            await expect(page.locator('#test1')).toHaveText('Test');
            await expect(page.locator('template > *')).toHaveCount(0);
        });

        test('preserves data in the host shadow root', async ({ page }) => {
            const operation = await page.evaluateHandle(createEmpty);

            const values = await page.evaluate((operation) => {
                const node = document.getElementById('test1');
                const shadow = document.getElementById('outer1').attachShadow({ mode: 'open' });
                shadow.appendChild(node);

                $.setData([shadow, node], 'test', 'Test');
                operation('#outer1');

                return [shadow, node].map((node) => $.getData(node, 'test'));
            }, operation);

            expect(values).toEqual(['Test', 'Test']);
            await expect(page.locator('#test1')).toHaveText('Test');
            await expect(page.locator('#inner1')).toHaveCount(0);
        });

        test('preserves data inside template contents', async ({ page }) => {
            const operation = await page.evaluateHandle(createEmpty);

            const values = await page.evaluate((operation) => {
                const node = document.getElementById('test1');
                const template = document.createElement('template');
                template.content.appendChild(node);
                template.appendChild(document.getElementById('outer1'));
                document.body.appendChild(template);

                $.setData([template.content, node], 'test', 'Test');
                operation(template);
                document.body.appendChild(template.content);

                return [template.content, node].map((node) => $.getData(node, 'test'));
            }, operation);

            expect(values).toEqual(['Test', 'Test']);
            await expect(page.locator('#test1')).toHaveText('Test');
            await expect(page.locator('template > *')).toHaveCount(0);
        });
    });

    test.describe('removal events', () => {
        test('triggers a remove event recursively', async ({ page }) => {
            const operation = await page.evaluateHandle(createEmpty);

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
