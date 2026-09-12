import { expect, test } from '#test';

/**
 * Registers shared findOne selector tests.
 * @param {((args: [string]) => Array<string>)} findOne The browser callback returning matching node IDs.
 */
export function findOneTests(findOne) {
    test.describe('selectors', () => {
        for (const [name, selector, expected] of [
            ['finds elements by query selector', '#parent1 > #child1 > span, #parent1 > #child2 > span', ['span1']],
            ['finds elements by ID', '#parent1', ['parent1']],
            ['finds elements by class name', '.span1', ['span1']],
            ['finds elements by tag name', 'span', ['span1']],
        ]) {
            test(name, async ({ page }) => {
                const ids = await page.evaluate(findOne, [selector]);

                expect(ids).toEqual(expected);
            });
        }
    });
}
