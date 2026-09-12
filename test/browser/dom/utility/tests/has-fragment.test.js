import { hasFragmentTests, setup } from '#cases/utility/tests/has-fragment.js';
import { expect, test } from '#test';

test.describe('#hasFragment', () => {
    test.beforeEach(setup);

    hasFragmentTests((nodes) => $.hasFragment(nodes));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasFragment(document.getElementById('template1')))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasFragment(document.querySelectorAll('template')))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasFragment(document.body.children))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasFragment([
                document.getElementById('template1'),
                document.getElementById('template2'),
                document.getElementById('div1'),
                document.getElementById('div2'),
            ]))).toBe(true);
    });
});
