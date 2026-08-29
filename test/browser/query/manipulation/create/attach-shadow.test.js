import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #attachShadow', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('attaches a shadow root to the first node', async ({ page }) => {
        const result = await page.evaluate(() => {
            const shadowRoot = $('#test').attachShadow().get(0);

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
            const shadowRoot = $('#test').attachShadow({ open: false }).get(0);

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

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const rootQuery = $('#test');
            const shadowQuery = rootQuery.attachShadow();

            return shadowQuery.constructor.name === 'QuerySet' && rootQuery !== shadowQuery;
        });

        expect(isNewQuerySet).toBe(true);
    });
});
