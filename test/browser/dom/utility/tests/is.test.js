import { isTests, setup } from '#cases/utility/tests/is.js';
import { expect, test } from '#test';

test.describe('#is', () => {
    test.beforeEach(setup);

    isTests((args) => $.is(...args));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.is(document.getElementById('div1'), '.test'))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.is(document.querySelectorAll('div'), '.test'))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.is(document.body.children, '.test'))).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            return $.is(fragment);
        })).toBe(true);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            return $.is(shadow);
        })).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.is([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ], '.test'))).toBe(true);
    });

    test('works with function filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.is('div', (node) => node.classList.contains('test')))).toBe(true);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.is('div', document.getElementById('div1')))).toBe(true);
    });

    test('works with NodeList filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.is('div', document.querySelectorAll('div')))).toBe(true);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.is('div', document.body.children))).toBe(true);
    });

    test('works with DocumentFragment filter', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            return $.is([fragment], fragment);
        })).toBe(true);
    });

    test('works with ShadowRoot filter', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            return $.is([shadow], shadow);
        })).toBe(true);
    });

    test('works with array filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.is('div', [
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]))).toBe(true);
    });
});
