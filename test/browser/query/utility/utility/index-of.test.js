import { indexOfTests, setup } from '#cases/utility/utility/index-of.js';
import { expect, test } from '#test';

test.describe('QuerySet #indexOf', () => {
    test.beforeEach(setup);

    indexOfTests(([nodes, ...args]) => $(nodes).indexOf(...args));

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            return $(fragment).indexOf();
        })).toBe(0);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            return $(shadow).indexOf();
        })).toBe(0);
    });

    test('works with function filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div').indexOf((node) => node.id === 'div2'))).toBe(1);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div').indexOf(document.getElementById('div2')))).toBe(1);
    });

    test('works with NodeList filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div').indexOf(document.querySelectorAll('.test')))).toBe(1);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div').indexOf(document.body.children))).toBe(0);
    });

    test('works with DocumentFragment filter', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            return $([
                document.getElementById('div2'),
                document.getElementById('div4'),
                fragment,
            ]).indexOf(fragment);
        })).toBe(2);
    });

    test('works with ShadowRoot filter', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            return $([
                document.getElementById('div2'),
                document.getElementById('div4'),
                shadow,
            ]).indexOf(shadow);
        })).toBe(2);
    });

    test('works with array filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .indexOf([
                        document.getElementById('div2'),
                        document.getElementById('div4'),
                    ]))).toBe(1);
    });

    test('works with QuerySet filter', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('.test');
            return $('div').indexOf(query);
        })).toBe(1);
    });
});
