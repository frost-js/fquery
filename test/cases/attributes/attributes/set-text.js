/** @import { Page } from '@playwright/test'; */
/** @import { setText } from '../../../../src/attributes/attributes.js'; */

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
        document.body.innerHTML = '<div id="test1"><div><span id="inner">Test 1</span></div></div><div id="test2"></div>';
    });
};

/**
 * Registers shared setText behavior tests.
 * @param {() => typeof setText} createSetText Creates the browser-side method adapter.
 */
export function setTextTests(createSetText) {
    test.describe('content replacement', () => {
        test('sets the text contents for all nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createSetText);

            await page.evaluate((operation) => {
                operation('div', 'Test 2');
            }, operation);

            await expect(page.locator('#test1')).toHaveText('Test 2');
            await expect(page.locator('#test2')).toHaveText('Test 2');
            await expect(page.locator('#test1 > *')).toHaveCount(0);
        });

        test('sets text contents for nodes with a string content property', async ({ page }) => {
            const operation = await page.evaluateHandle(createSetText);

            await page.evaluate((operation) => {
                document.getElementById('test1').content = 'Test 1';

                operation('#test1', 'Test 2');
            }, operation);

            await expect(page.locator('#test1')).toHaveText('Test 2');
            await expect(page.locator('#test1 > *')).toHaveCount(0);
        });

        test('escapes HTML strings', async ({ page }) => {
            const operation = await page.evaluateHandle(createSetText);

            await page.evaluate((operation) => {
                operation('#test1', '<span>Test 2</span>');
            }, operation);

            await expect(page.locator('#test1')).toHaveText('<span>Test 2</span>');
            await expect(page.locator('#test1 > span')).toHaveCount(0);
            expect(await page.locator('#test1').innerHTML()).toBe('&lt;span&gt;Test 2&lt;/span&gt;');
        });
    });

    test.describe('cleanup', () => {
        test('removes events recursively', async ({ page }) => {
            const operation = await page.evaluateHandle(createSetText);

            const clickCount = await page.evaluate((operation) => {
                let count = 0;
                const node = document.getElementById('inner');

                $.addEvent(node, 'click', () => {
                    count++;
                });

                operation('div', 'Test 2');
                document.body.appendChild(node);
                $.triggerEvent(node, 'click');

                return count;
            }, operation);

            expect(clickCount).toBe(0);
        });

        test('removes data recursively', async ({ page }) => {
            const operation = await page.evaluateHandle(createSetText);

            const storedValue = await page.evaluate((operation) => {
                const node = document.getElementById('inner');

                $.setData(node, 'test', 'Test');
                operation('div', 'Test 2');
                document.body.appendChild(node);

                return $.getData(node, 'test');
            }, operation);

            expect(storedValue).toBeUndefined();
        });

        test('removes animations recursively', async ({ page }) => {
            const operation = await page.evaluateHandle(createSetText);

            await setupClock(page);

            await page.evaluate(() => {
                $.animate('#inner', () => {}, { duration: 100, debug: true });
            });

            await advanceClock(page, 20);

            expect(await page.evaluate(() => Boolean(document.getElementById('inner')?.dataset.animationProgress))).toBe(true);

            await page.evaluate((operation) => {
                const node = document.getElementById('inner');

                operation('div', 'Test 2');
                document.body.appendChild(node);
            }, operation);

            expect(await page.evaluate(() => {
                const node = document.getElementById('inner');

                return Boolean(node) &&
                    !node.dataset.animationProgress &&
                    !node.dataset.animationStart &&
                    !node.dataset.animationTime;
            })).toBe(true);
        });

        test('removes queue recursively', async ({ page }) => {
            const operation = await page.evaluateHandle(createSetText);

            await setupClock(page);

            await page.evaluate(() => {
                window.innerQueueStartedAt = null;

                $.queue('#inner', () => new Promise((resolve) => {
                    window.innerQueueStartedAt = performance.now();
                    setTimeout(resolve, 100);
                }));

                $.queue('#inner', (node) => {
                    node.dataset.test = 'Test';
                });
            });

            await advanceClock(page, 10);
            await expect.poll(async () =>
                await page.evaluate(() => window.innerQueueStartedAt !== null)).toBe(true);

            await page.evaluate((operation) => {
                const node = document.getElementById('inner');

                operation('div', 'Test 2');
                document.body.appendChild(node);
            }, operation);

            await advanceClock(page, 120);

            await expect(page.locator('#test1')).toHaveText('Test 2');
            await expect(page.locator('#test2')).toHaveText('Test 2');
            await expect(page.locator('#inner')).toHaveText('Test 1');
            expect(await page.locator('#inner').getAttribute('data-test')).toBeNull();
        });

        test('triggers a remove event recursively', async ({ page }) => {
            const operation = await page.evaluateHandle(createSetText);

            const removeEventCount = await page.evaluate((operation) => {
                let count = 0;

                $.addEvent('#inner', 'remove', () => {
                    count++;
                });

                operation('div', 'Test 2');

                return count;
            }, operation);

            expect(removeEventCount).toBe(1);
        });
    });

    test.describe('shadow and template contents', () => {
        test('preserves events in the host shadow root', async ({ page }) => {
            const operation = await page.evaluateHandle(createSetText);

            const clickCount = await page.evaluate((operation) => {
                let count = 0;
                const node = document.getElementById('inner');
                const shadow = document.getElementById('test1').attachShadow({ mode: 'open' });
                shadow.appendChild(node);

                $.addEvent([shadow, node], 'click', () => {
                    count++;
                });

                operation('#test1', 'Test 2');
                $.triggerEvent(node, 'click');

                return count;
            }, operation);

            expect(clickCount).toBe(2);
            await expect(page.locator('#inner')).toHaveText('Test 1');
        });

        test('preserves events inside template contents', async ({ page }) => {
            const operation = await page.evaluateHandle(createSetText);

            const clickCount = await page.evaluate((operation) => {
                let count = 0;
                const node = document.getElementById('inner');
                const template = document.createElement('template');
                template.content.appendChild(node);
                template.appendChild(document.getElementById('test1'));
                document.body.appendChild(template);

                $.addEvent(node, 'click', () => {
                    count++;
                });

                operation(template, 'Test 2');
                document.body.appendChild(template.content);
                $.triggerEvent(node, 'click');

                return count;
            }, operation);

            expect(clickCount).toBe(1);
            await expect(page.locator('#inner')).toHaveText('Test 1');
            await expect(page.locator('template > *')).toHaveCount(0);
            await expect(page.locator('template')).toHaveText('Test 2');
        });

        test('preserves data in the host shadow root', async ({ page }) => {
            const operation = await page.evaluateHandle(createSetText);

            const storedValue = await page.evaluate((operation) => {
                const node = document.getElementById('inner');
                const shadow = document.getElementById('test1').attachShadow({ mode: 'open' });
                shadow.appendChild(node);

                $.setData(node, 'test', 'Test');
                operation('#test1', 'Test 2');

                return $.getData(node, 'test');
            }, operation);

            expect(storedValue).toBe('Test');
            await expect(page.locator('#inner')).toHaveText('Test 1');
        });

        test('preserves data inside template contents', async ({ page }) => {
            const operation = await page.evaluateHandle(createSetText);

            const storedValue = await page.evaluate((operation) => {
                const node = document.getElementById('inner');
                const template = document.createElement('template');
                template.content.appendChild(node);
                template.appendChild(document.getElementById('test1'));
                document.body.appendChild(template);

                $.setData(node, 'test', 'Test');
                operation(template, 'Test 2');
                document.body.appendChild(template.content);

                return $.getData(node, 'test');
            }, operation);

            expect(storedValue).toBe('Test');
            await expect(page.locator('#inner')).toHaveText('Test 1');
            await expect(page.locator('template > *')).toHaveCount(0);
            await expect(page.locator('template')).toHaveText('Test 2');
        });
    });
}
