/** @import { Page } from '@playwright/test'; */
/** @import { replaceAll } from '../../../../src/manipulation/manipulation.js'; */

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
            '<div class="outer1">' +
            '<div class="inner1">' +
            '<a href="#">Test</a>' +
            '<a href="#">Test</a>' +
            '</div>' +
            '</div>' +
            '<div class="outer2">' +
            '<div class="inner2">' +
            '<a href="#">Test</a>' +
            '<a href="#">Test</a>' +
            '</div>' +
            '</div>';
    });
};

/**
 * Registers shared replaceAll behavior tests.
 * @param {() => typeof replaceAll} createReplaceAll Creates the browser-side method adapter.
 */
export function replaceAllTests(createReplaceAll) {
    test('replaces each other node with nodes', async ({ page }) => {
        const operation = await page.evaluateHandle(createReplaceAll);

        await operation.evaluate((operation, args) => operation(...args), ['a', 'div']);

        await expect(page.locator('body > a')).toHaveCount(8);
        await expect(page.locator('body > div')).toHaveCount(0);
    });

    test.describe('replacement placement', () => {
        test('does not clone for the last nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceAll);

            const nodes = await page.evaluateHandle(() => [...document.querySelectorAll('a')]);

            await operation.evaluate((operation, args) => operation(...args), ['a', 'div']);

            const isSameNode = await nodes.evaluate((nodes) => {
                return nodes.every((node, index) =>
                    node.isSameNode(document.querySelectorAll('body > a').item(index + 4)));
            });

            expect(isSameNode).toBe(true);
        });
    });

    test.describe('unchanged replacements', () => {
        test('does not move a node when targets include itself and its descendant', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceAll);

            const node = await page.evaluateHandle(() => document.querySelector('.outer1'));
            const child = await node.evaluateHandle((node) => node.querySelector('.inner1'));
            const position = await node.evaluateHandle((node) => ({
                parentNode: node.parentNode,
                previousSibling: node.previousSibling,
                nextSibling: node.nextSibling,
            }));

            await operation.evaluate((operation, args) => operation(...args), [node, [node, child]]);

            const isSamePosition = await node.evaluate((node, { position, child }) => {
                const { parentNode, previousSibling, nextSibling } = position;

                return node.parentNode === parentNode &&
                    node.previousSibling === previousSibling &&
                    node.nextSibling === nextSibling &&
                    child.parentNode === node;
            }, { position, child });

            expect(isSamePosition).toBe(true);
        });
    });

    test.describe('cleanup', () => {
        test('removes events from other nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceAll);

            const clickCount = await page.evaluate((operation) => {
                let count = 0;
                const nodes = [...document.querySelectorAll('div')];

                $.addEvent('div', 'click', () => {
                    count++;
                });

                operation('a', 'div');

                for (const node of nodes) {
                    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                }

                return count;
            }, operation);

            expect(clickCount).toBe(0);
        });

        test('does not remove events for nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceAll);

            const clickCount = await page.evaluate((operation) => {
                let count = 0;

                $.addEvent('a', 'click', () => {
                    count++;
                });

                operation('a', 'div');
                $.triggerEvent('a', 'click');

                return count;
            }, operation);

            expect(clickCount).toBe(8);
        });

        test('removes data from other nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceAll);

            const values = await page.evaluate((operation) => {
                const nodes = [...document.querySelectorAll('div')];

                $.setData('div', 'test', 'Test');
                operation('a', 'div');

                return nodes.map((node) => $.getData(node, 'test'));
            }, operation);

            expect(values).toEqual([undefined, undefined, undefined, undefined]);
        });

        test('does not remove data for nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceAll);

            const values = await page.evaluate((operation) => {
                $.setData('a', 'test', 'Test');
                operation('a', 'div');

                return [...document.querySelectorAll('body > a')].map((node) => $.getData(node, 'test'));
            }, operation);

            expect(values).toEqual([
                'Test',
                'Test',
                'Test',
                'Test',
                'Test',
                'Test',
                'Test',
                'Test',
            ]);
        });

        test('removes animations from other nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceAll);

            await setupClock(page);

            await page.evaluate(() => {
                $.animate('div', () => {}, { duration: 100, debug: true });
            });

            await advanceClock(page, 20);

            expect(await page.evaluate(() =>
                ['.outer1', '.inner1', '.outer2', '.inner2'].every((selector) =>
                    Boolean(document.querySelector(selector)?.dataset.animationProgress)),
            )).toBe(true);

            await page.evaluate((operation) => {
                const nodes = [...document.querySelectorAll('div')];

                operation('a', 'div');

                for (const node of nodes) {
                    document.body.appendChild(node);
                }
            }, operation);

            expect(await page.evaluate(() =>
                ['.outer1', '.inner1', '.outer2', '.inner2'].every((selector) => {
                    const node = document.querySelector(selector);

                    return Boolean(node) &&
                        !node.dataset.animationProgress &&
                        !node.dataset.animationStart &&
                        !node.dataset.animationTime;
                }),
            )).toBe(true);
        });

        test('does not remove animations for nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceAll);

            await setupClock(page);

            await page.evaluate((operation) => {
                $.animate('a', () => {}, { duration: 100, debug: true });
                operation('a', 'div');
            }, operation);

            await advanceClock(page, 20);

            expect(await page.evaluate(() => {
                const nodes = [...document.querySelectorAll('body > a')];

                return nodes.length === 8 &&
                    nodes.every((node) => Boolean(node.dataset.animationProgress));
            })).toBe(true);

            await advanceClock(page, 100);

            expect(await page.evaluate(() => {
                const nodes = [...document.querySelectorAll('body > a')];

                return nodes.length === 8 &&
                    nodes.every((node) =>
                        !node.dataset.animationProgress &&
                        !node.dataset.animationStart &&
                        !node.dataset.animationTime);
            })).toBe(true);
        });

        test('removes queue from other nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceAll);

            await page.evaluate(async (operation) => {
                const nodes = [...document.querySelectorAll('div')];
                const queueResolvers = [];
                let resolveAllStarted;
                const allStarted = new Promise((resolve) => {
                    resolveAllStarted = resolve;
                });

                $.queue('div', () => new Promise((resolve) => {
                    queueResolvers.push(resolve);

                    if (queueResolvers.length === nodes.length) {
                        resolveAllStarted();
                    }
                }));

                $.queue('div', (node) => {
                    node.dataset.test = 'Test';
                });

                await allStarted;

                operation('a', 'div');

                for (const node of nodes) {
                    document.body.appendChild(node);
                }

                queueResolvers.forEach((resolve) => {
                    resolve();
                });

                await new Promise((resolve) => {
                    setTimeout(resolve, 0);
                });
            }, operation);

            await expect(page.locator('body > a')).toHaveCount(8);
            await expect(page.locator('body > div')).toHaveCount(4);
            expect(await page.locator('.outer1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('.inner1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('.outer2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('.inner2').getAttribute('data-test')).toBeNull();
        });
    });

    test.describe('removal events', () => {
        test('triggers a remove event for other nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceAll);

            const removeCount = await page.evaluate((operation) => {
                let count = 0;

                $.addEvent('div', 'remove', () => {
                    count++;
                });

                operation('a', 'div');

                return count;
            }, operation);

            expect(removeCount).toBe(4);
        });
    });
}
