import { hasDataTests, setup } from '#cases/utility/tests/has-data.js';
import { expect, test } from '#test';

test.describe('#hasData', () => {
    test.beforeEach(setup);

    hasDataTests((args) => $.hasData(...args));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasData(document.getElementById('div1')))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasData(document.querySelectorAll('div')))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasData(document.body.children))).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            $.setData(fragment, 'test', 'Test');
            return $.hasData(fragment);
        })).toBe(true);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.setData(shadow, 'test', 'Test');
            return $.hasData(shadow);
        })).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(document, 'test', 'Test');
            return $.hasData(document);
        })).toBe(true);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(window, 'test', 'Test');
            return $.hasData(window);
        })).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasData([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]))).toBe(true);
    });
});
