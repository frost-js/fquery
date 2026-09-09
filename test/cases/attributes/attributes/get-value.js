import { expect, test } from '#test';

/**
 * Registers shared getValue fixtures and behavior tests.
 * @param {function(string): *} getValue The browser callback for reading a node value.
 */
export function getValueTests(getValue) {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<input type="text" id="test1" value="Test 1">' +
                '<input type="number" id="test2">' +
                '<textarea id="test3">Test 2</textarea>' +
                '<select id="test4"><option value="1">1</option><option value="2" selected>2</option></select>' +
                '<select id="test5"><option value="3">3</option><option value="4" selected>4</option></select>';
        });
    });

    for (const [name, selector, expected] of [
        ['returns the input value of the first node', 'input', 'Test 1'],
        ['returns undefined for empty nodes', '#invalid', undefined],
        ['works with textarea input nodes', 'textarea', 'Test 2'],
        ['works with select input nodes', 'select', '2'],
    ]) {
        test(name, async ({ page }) => {
            const value = await page.evaluate(getValue, selector);

            expect(value).toBe(expected);
        });
    }
}
