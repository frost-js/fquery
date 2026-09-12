/** @import { Page } from '@playwright/test'; */
/** @import { NodeInput } from '../../../../src/helpers.js'; */

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
 * @param {((args: [NodeInput, NodeInput]) => void)} replaceWith The browser callback for replaceWith.
 */
export function replaceWithTests(replaceWith) {
    test('replaces each node with other nodes', async ({ page }) => {
        await page.evaluate(replaceWith, ['div', 'a']);

        await expect(page.locator('body > a')).toHaveCount(8);
        await expect(page.locator('body > div')).toHaveCount(0);
    });

    test('works with HTML other nodes', async ({ page }) => {
        await page.evaluate(replaceWith, ['a', '<div><span class="test">Test</span></div>']);

        await expect(page.locator('a')).toHaveCount(0);
        await expect(page.locator('span.test')).toHaveCount(4);
    });

    test.describe('replacement placement', () => {
        test('inserts the original replacement when the final target is detached', async ({ page }) => {
            const node = await page.evaluateHandle(() => document.querySelector('.outer1'));
            const detached = await page.evaluateHandle(() => document.createElement('div'));
            const replacement = await page.evaluateHandle(() => document.querySelector('.inner2 a'));

            await page.evaluate(replaceWith, [[node, detached], replacement]);

            const isOriginal = await replacement.evaluate((replacement) => document.body.firstElementChild === replacement);

            expect(isOriginal).toBe(true);
            await expect(page.locator('.outer1')).toHaveCount(0);
        });

        test('does not clone for the last other nodes', async ({ page }) => {
            const nodes = await page.evaluateHandle(() => [...document.querySelectorAll('a')]);

            await page.evaluate(replaceWith, ['div', 'a']);

            const isSameNode = await nodes.evaluate((nodes) => {
                return nodes.every((node, index) =>
                    node.isSameNode(document.querySelectorAll('body > a').item(index + 4)));
            });

            expect(isSameNode).toBe(true);
        });
    });

    test.describe('unchanged replacements', () => {
        test('does not move replacement nodes when the target set is empty', async ({ page }) => {
            const node = await page.evaluateHandle(() => document.querySelector('.inner1 a'));
            const position = await node.evaluateHandle((node) => ({
                parentNode: node.parentNode,
                previousSibling: node.previousSibling,
                nextSibling: node.nextSibling,
            }));

            await page.evaluate(replaceWith, [[], node]);

            const isSamePosition = await node.evaluate((node, position) => {
                const { parentNode, previousSibling, nextSibling } = position;

                return node.parentNode === parentNode &&
                    node.previousSibling === previousSibling &&
                    node.nextSibling === nextSibling;
            }, position);

            expect(isSamePosition).toBe(true);
        });

        test('does not move a node when replacing it with itself', async ({ page }) => {
            const node = await page.evaluateHandle(() => document.querySelector('.inner1 a'));
            const position = await node.evaluateHandle((node) => ({
                parentNode: node.parentNode,
                previousSibling: node.previousSibling,
                nextSibling: node.nextSibling,
            }));

            await page.evaluate(replaceWith, [node, node]);

            const isSamePosition = await node.evaluate((node, position) => {
                const { parentNode, previousSibling, nextSibling } = position;

                return node.parentNode === parentNode &&
                    node.previousSibling === previousSibling &&
                    node.nextSibling === nextSibling;
            }, position);

            expect(isSamePosition).toBe(true);
        });

        test('does not move a node when targets include itself and its descendant', async ({ page }) => {
            const node = await page.evaluateHandle(() => document.querySelector('.outer1'));
            const child = await node.evaluateHandle((node) => node.querySelector('.inner1'));
            const position = await node.evaluateHandle((node) => ({
                parentNode: node.parentNode,
                previousSibling: node.previousSibling,
                nextSibling: node.nextSibling,
            }));

            await page.evaluate(replaceWith, [[node, child], node]);

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
}
