/** @import { Page } from '@playwright/test'; */
/** @import { replaceWith } from '../../../../src/manipulation/manipulation.js'; */

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
 * Registers shared replaceWith behavior tests.
 * @param {() => typeof replaceWith} createReplaceWith Creates the browser-side method adapter.
 */
export function replaceWithTests(createReplaceWith) {
    test('replaces each node with other nodes', async ({ page }) => {
        const operation = await page.evaluateHandle(createReplaceWith);

        await operation.evaluate((operation, args) => operation(...args), ['div', 'a']);

        await expect(page.locator('body > a')).toHaveCount(8);
        await expect(page.locator('body > div')).toHaveCount(0);
    });

    test('works with HTML other nodes', async ({ page }) => {
        const operation = await page.evaluateHandle(createReplaceWith);

        await operation.evaluate((operation, args) => operation(...args), ['a', '<div><span class="test">Test</span></div>']);

        await expect(page.locator('a')).toHaveCount(0);
        await expect(page.locator('span.test')).toHaveCount(4);
    });

    test.describe('replacement placement', () => {
        test('inserts the original replacement when the final target is detached', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceWith);

            const node = await page.evaluateHandle(() => document.querySelector('.outer1'));
            const detached = await page.evaluateHandle(() => document.createElement('div'));
            const replacement = await page.evaluateHandle(() => document.querySelector('.inner2 a'));

            await operation.evaluate((operation, args) => operation(...args), [[node, detached], replacement]);

            const isOriginal = await replacement.evaluate((replacement) => document.body.firstElementChild === replacement);

            expect(isOriginal).toBe(true);
            await expect(page.locator('.outer1')).toHaveCount(0);
        });

        test('does not clone for the last other nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceWith);

            const nodes = await page.evaluateHandle(() => [...document.querySelectorAll('a')]);

            await operation.evaluate((operation, args) => operation(...args), ['div', 'a']);

            const isSameNode = await nodes.evaluate((nodes) => {
                return nodes.every((node, index) =>
                    node.isSameNode(document.querySelectorAll('body > a').item(index + 4)));
            });

            expect(isSameNode).toBe(true);
        });
    });

    test.describe('unchanged replacements', () => {
        test('does not move replacement nodes when the target set is empty', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceWith);

            const node = await page.evaluateHandle(() => document.querySelector('.inner1 a'));
            const position = await node.evaluateHandle((node) => ({
                parentNode: node.parentNode,
                previousSibling: node.previousSibling,
                nextSibling: node.nextSibling,
            }));

            await operation.evaluate((operation, args) => operation(...args), [[], node]);

            const isSamePosition = await node.evaluate((node, position) => {
                const { parentNode, previousSibling, nextSibling } = position;

                return node.parentNode === parentNode &&
                    node.previousSibling === previousSibling &&
                    node.nextSibling === nextSibling;
            }, position);

            expect(isSamePosition).toBe(true);
        });

        test('does not move a node when replacing it with itself', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceWith);

            const node = await page.evaluateHandle(() => document.querySelector('.inner1 a'));
            const position = await node.evaluateHandle((node) => ({
                parentNode: node.parentNode,
                previousSibling: node.previousSibling,
                nextSibling: node.nextSibling,
            }));

            await operation.evaluate((operation, args) => operation(...args), [node, node]);

            const isSamePosition = await node.evaluate((node, position) => {
                const { parentNode, previousSibling, nextSibling } = position;

                return node.parentNode === parentNode &&
                    node.previousSibling === previousSibling &&
                    node.nextSibling === nextSibling;
            }, position);

            expect(isSamePosition).toBe(true);
        });

        test('does not move a node when targets include itself and its descendant', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceWith);

            const node = await page.evaluateHandle(() => document.querySelector('.outer1'));
            const child = await node.evaluateHandle((node) => node.querySelector('.inner1'));
            const position = await node.evaluateHandle((node) => ({
                parentNode: node.parentNode,
                previousSibling: node.previousSibling,
                nextSibling: node.nextSibling,
            }));

            await operation.evaluate((operation, args) => operation(...args), [[node, child], node]);

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
        test('removes events from nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceWith);

            const clickCount = await page.evaluate((operation) => {
                let count = 0;
                const nodes = [...document.querySelectorAll('div')];

                $.addEvent('div', 'click', () => {
                    count++;
                });

                operation('div', 'a');

                for (const node of nodes) {
                    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                }

                return count;
            }, operation);

            expect(clickCount).toBe(0);
        });

        test('does not remove events for other nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceWith);

            const clickCount = await page.evaluate((operation) => {
                let count = 0;

                $.addEvent('a', 'click', () => {
                    count++;
                });

                operation('div', 'a');
                $.triggerEvent('a', 'click');

                return count;
            }, operation);

            expect(clickCount).toBe(8);
        });

        test('removes data from nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceWith);

            const values = await page.evaluate((operation) => {
                const nodes = [...document.querySelectorAll('div')];

                $.setData('div', 'test', 'Test');
                operation('div', 'a');

                return nodes.map((node) => $.getData(node, 'test'));
            }, operation);

            expect(values).toEqual([undefined, undefined, undefined, undefined]);
        });

        test('does not remove data for other nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceWith);

            const values = await page.evaluate((operation) => {
                $.setData('a', 'test', 'Test');
                operation('div', 'a');

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

        test('removes animations from nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceWith);

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

                operation('div', 'a');

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

        test('does not remove animations for other nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceWith);

            await setupClock(page);

            await page.evaluate((operation) => {
                $.animate('a', () => {}, { duration: 100, debug: true });
                operation('div', 'a');
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

        test('removes queue from nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceWith);

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

                operation('div', 'a');

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
        test('triggers a remove event for nodes', async ({ page }) => {
            const operation = await page.evaluateHandle(createReplaceWith);

            const removeCount = await page.evaluate((operation) => {
                let count = 0;

                $.addEvent('div', 'remove', () => {
                    count++;
                });

                operation('div', 'a');

                return count;
            }, operation);

            expect(removeCount).toBe(4);
        });
    });
}
