import { isSameTests, setup } from '#cases/utility/tests/is-same.js';
import { expect, test } from '#test';

test.describe('QuerySet #isSame', () => {
    test.beforeEach(setup);

    isSameTests(([nodes, ...args]) => $(nodes).isSame(...args));

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            return $(fragment).isSame([fragment]);
        })).toBe(true);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            return $(shadow).isSame([shadow]);
        })).toBe(true);
    });

    test('works with HTMLElement other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div').isSame(document.getElementById('div2')))).toBe(true);
    });

    test('works with NodeList other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div').isSame(document.querySelectorAll('#div2, #div4')))).toBe(true);
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div').isSame(document.body.children))).toBe(true);
    });

    test('works with DocumentFragment other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            return $([fragment]).isSame(fragment);
        })).toBe(true);
    });

    test('works with ShadowRoot other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            return $([shadow]).isSame(shadow);
        })).toBe(true);
    });

    test('works with array other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .isSame([
                        document.querySelector('#div2'),
                        document.querySelector('#div4'),
                    ]))).toBe(true);
    });

    test('works with QuerySet other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('#div2, #div4');
            return $('div').isSame(query);
        })).toBe(true);
    });
});
