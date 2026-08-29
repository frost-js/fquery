import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#attachShadow', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('attaches a shadow root to the first node', async ({ page }) => {
        const result = await page.evaluate(() => {
            const shadowRoot = $.attachShadow('#test');

            return {
                returnedShadowRoot: shadowRoot instanceof ShadowRoot,
                elementShadowRoot: document.getElementById('test').shadowRoot instanceof ShadowRoot,
            };
        });

        expect(result).toEqual({
            returnedShadowRoot: true,
            elementShadowRoot: true,
        });
    });

    test('attaches a closed shadow root to the first node', async ({ page }) => {
        const result = await page.evaluate(() => {
            const shadowRoot = $.attachShadow('#test', { open: false });

            return {
                returnedShadowRoot: shadowRoot instanceof ShadowRoot,
                elementShadowRoot: document.getElementById('test').shadowRoot,
            };
        });

        expect(result).toEqual({
            returnedShadowRoot: true,
            elementShadowRoot: null,
        });
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const hasShadowRoot = await page.evaluate(() => {
            const element = document.getElementById('test');

            $.attachShadow(element);

            return element.shadowRoot instanceof ShadowRoot;
        });

        expect(hasShadowRoot).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const hasShadowRoot = await page.evaluate(() => {
            $.attachShadow(document.querySelectorAll('div'));

            return document.getElementById('test').shadowRoot instanceof ShadowRoot;
        });

        expect(hasShadowRoot).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const hasShadowRoot = await page.evaluate(() => {
            $.attachShadow(document.body.children);

            return document.getElementById('test').shadowRoot instanceof ShadowRoot;
        });

        expect(hasShadowRoot).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        const hasShadowRoot = await page.evaluate(() => {
            const element = document.getElementById('test');

            $.attachShadow([element]);

            return element.shadowRoot instanceof ShadowRoot;
        });

        expect(hasShadowRoot).toBe(true);
    });
});
