import { expect, test } from '#test';

/**
 * Registers shared find selector tests.
 * @param {((args: [string]) => Array<string>)} find The browser callback returning matching node IDs.
 */
export function findTests(find) {
    test.describe('selectors', () => {
        for (const [name, selector, expected] of [
            ['finds elements by query selector', '#parent1 > #child1 > span, #parent1 > #child2 > span', ['span1', 'span2', 'span3', 'span4']],
            ['finds elements by ID', '#parent1', ['parent1']],
            ['finds elements by class name', '.span1', ['span1', 'span2', 'span3', 'span4', 'span5', 'span6']],
            ['finds elements by tag name', 'span', ['span1', 'span2', 'span3', 'span4', 'span5', 'span6', 'span7', 'span8', 'span9', 'span10', 'span11', 'span12']],
        ]) {
            test(name, async ({ page }) => {
                const ids = await page.evaluate(find, [selector]);

                expect(ids).toEqual(expected);
            });
        }
    });
}
