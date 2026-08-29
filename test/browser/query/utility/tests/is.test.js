import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #is', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1" class="test"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3" class="test"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('returns true if any node matches a filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .is('.test'))).toBe(true);
    });

    test('returns false if no nodes match a filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div:not(.test)')
                    .is('.test'))).toBe(false);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            return $(fragment)
                    .is();
        })).toBe(true);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            return $(shadow)
                    .is();
        })).toBe(true);
    });

    test('works with function filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .is((node) => node.classList.contains('test')))).toBe(true);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .is(
                        document.getElementById('div1'),
                    ))).toBe(true);
    });

    test('works with NodeList filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .is(
                        document.querySelectorAll('div'),
                    ))).toBe(true);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .is(
                        document.body.children,
                    ))).toBe(true);
    });

    test('works with DocumentFragment filter', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            return $([fragment])
                    .is(fragment);
        })).toBe(true);
    });

    test('works with ShadowRoot filter', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            return $([shadow])
                    .is(shadow);
        })).toBe(true);
    });

    test('works with array filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .is([
                        document.getElementById('div1'),
                        document.getElementById('div2'),
                        document.getElementById('div3'),
                        document.getElementById('div4'),
                    ]))).toBe(true);
    });

    test('works with QuerySet filter', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return $('div')
                    .is(query);
        })).toBe(true);
    });
});
