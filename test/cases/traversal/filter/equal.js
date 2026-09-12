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
        document.body.innerHTML = '<div id="parent1"><span data-id="span1"></span><span data-id="span2"></span><span data-id="span3"></span></div><div id="parent2"><span data-id="span2"></span><span data-id="span3"></span><span data-id="span4"></span></div>';
    });
};

/**
 * Registers shared equal behavior tests.
 * @param {((args: [NodeInput, NodeInput]) => Array<string>)} equal The browser callback for equal.
 */
export function equalTests(equal) {
    test('returns nodes equal to other nodes', async ({ page }) => {
        const ids = await page.evaluate(equal, ['#parent1 span', '#parent2 span']);

        expect(ids).toEqual([
            'span2',
            'span3',
        ]);
    });

    test.describe('comparison inputs', () => {
        for (const [name, createArgs, expected] of [
            ['HTMLElement', () => ['#parent1 span', document.querySelector('#parent2 > [data-id="span2"]')], ['span2']],
            ['NodeList', () => ['#parent1 span', document.querySelectorAll('#parent2 > span')], ['span2', 'span3']],
            ['HTMLCollection', () => ['#parent1 span', document.getElementById('parent2').children], ['span2', 'span3']],
            ['array', () => ['#parent1 span', [document.querySelector('#parent2 > [data-id="span2"]'), document.querySelector('#parent2 > [data-id="span3"]')]], ['span2', 'span3']],
        ]) {
            test(`works with ${name} other nodes`, async ({ page }) => {
                const args = await page.evaluateHandle(createArgs);
                const ids = await page.evaluate(equal, args);

                expect(ids).toEqual(expected);
            });
        }
    });
}
