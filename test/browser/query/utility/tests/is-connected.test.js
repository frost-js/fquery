import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #isConnected', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('returns true if any node is connected to the DOM', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .isConnected())).toBe(true);
    });

    test('returns false if no nodes are connected to the DOM', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(
                document.createElement('div'),
            ).isConnected())).toBe(false);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            return $(fragment)
                    .isConnected();
        })).toBe(false);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.getElementById('div1');
            const shadow = div.attachShadow({ mode: 'open' });
            return $(shadow)
                    .isConnected();
        })).toBe(true);
    });
});
