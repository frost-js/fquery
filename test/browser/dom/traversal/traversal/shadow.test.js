import { expect, test } from '#test';

test.describe('#shadow', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML = '<div id="div1"></div><div id="div2"></div><div id="div3"></div>';
        });

        await page.evaluate(() => {
            document.getElementById('div1').attachShadow({ mode: 'open' });
            document.getElementById('div2').attachShadow({ mode: 'closed' });
        });
    });

    test('returns the shadow root of the first node', async ({ page }) => {
        const hasShadow = await page.evaluate(() => {
            const shadow = $.shadow('div');

            return shadow instanceof ShadowRoot;
        });

        expect(hasShadow).toBe(true);
    });

    test('returns null for closed shadow roots', async ({ page }) => {
        const shadow = await page.evaluate(() => $.shadow('#div2'));

        expect(shadow).toBe(null);
    });

    test('returns null for nodes without a shadow root', async ({ page }) => {
        const shadow = await page.evaluate(() => $.shadow('#div3'));

        expect(shadow).toBe(null);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const shadow = await page.evaluate(() => $.shadow('#invalid'));

        expect(shadow).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const hasShadow = await page.evaluate(() => {
            const shadow = $.shadow(document.getElementById('div1'));

            return shadow instanceof ShadowRoot;
        });

        expect(hasShadow).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const hasShadow = await page.evaluate(() => {
            const shadow = $.shadow(document.querySelectorAll('div'));

            return shadow instanceof ShadowRoot;
        });

        expect(hasShadow).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const hasShadow = await page.evaluate(() => {
            const shadow = $.shadow(document.body.children);

            return shadow instanceof ShadowRoot;
        });

        expect(hasShadow).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        const hasShadow = await page.evaluate(() => {
            const shadow = $.shadow([
                document.getElementById('div1'),
                document.getElementById('div2'),
            ]);

            return shadow instanceof ShadowRoot;
        });

        expect(hasShadow).toBe(true);
    });
});
