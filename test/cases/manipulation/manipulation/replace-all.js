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
 * Registers shared replaceAll behavior tests.
 * @param {((args: [NodeInput, NodeInput]) => void)} replaceAll The browser callback for replaceAll.
 */
export function replaceAllTests(replaceAll) {
    test('replaces each other node with nodes', async ({ page }) => {
        await page.evaluate(replaceAll, ['a', 'div']);

        await expect(page.locator('body > a')).toHaveCount(8);
        await expect(page.locator('body > div')).toHaveCount(0);
    });

    test.describe('replacement placement', () => {
        test('does not clone for the last nodes', async ({ page }) => {
            const nodes = await page.evaluateHandle(() => [...document.querySelectorAll('a')]);

            await page.evaluate(replaceAll, ['a', 'div']);

            const isSameNode = await nodes.evaluate((nodes) => {
                return nodes.every((node, index) =>
                    node.isSameNode(document.querySelectorAll('body > a').item(index + 4)));
            });

            expect(isSameNode).toBe(true);
        });
    });

    test.describe('unchanged replacements', () => {
        test('does not move a node when targets include itself and its descendant', async ({ page }) => {
            const node = await page.evaluateHandle(() => document.querySelector('.outer1'));
            const child = await node.evaluateHandle((node) => node.querySelector('.inner1'));
            const position = await node.evaluateHandle((node) => ({
                parentNode: node.parentNode,
                previousSibling: node.previousSibling,
                nextSibling: node.nextSibling,
            }));

            await page.evaluate(replaceAll, [node, [node, child]]);

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
