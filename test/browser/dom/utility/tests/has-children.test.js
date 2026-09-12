import { hasChildrenTests, setup } from '#cases/utility/tests/has-children.js';
import { expect, test } from '#test';

test.describe('#hasChildren', () => {
    test.beforeEach(setup);

    hasChildrenTests((nodes) => $.hasChildren(nodes));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasChildren(document.getElementById('div1')))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasChildren(document.querySelectorAll('div')))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasChildren(document.body.children))).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div></div>',
            );
            return $.hasChildren(fragment);
        })).toBe(true);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div></div>',
            );
            shadow.appendChild(fragment);
            return $.hasChildren(shadow);
        })).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasChildren(document))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasChildren([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]))).toBe(true);
    });
});
