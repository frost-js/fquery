import { hasCSSTransitionTests, setup } from '#cases/utility/tests/has-css-transition.js';
import { expect, test } from '#test';

test.describe('#hasCSSTransition', () => {
    test.beforeEach(setup);

    hasCSSTransitionTests((nodes) => $.hasCSSTransition(nodes));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasCSSTransition(document.getElementById('div1')))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasCSSTransition(document.querySelectorAll('div')))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasCSSTransition(document.body.children))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasCSSTransition([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]))).toBe(true);
    });
});
