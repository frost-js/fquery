import { getStyleTests, setup } from '#cases/attributes/styles/get-style.js';
import { expect, test } from '#test';

test.describe('#getStyle', () => {
    test.beforeEach(setup);

    getStyleTests((args) => $.getStyle(...args));

    test('returns an object with all style values for the first node', async ({ page }) => {
        const style = await page.evaluate((_) => $.getStyle('div'));

        expect(style).toEqual({
            display: 'block',
            width: '100px',
            height: '100px',
        });
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate((_) =>
            $.getStyle(document.getElementById('test1'), 'display'))).toBe('block');
    });

    test('works with NodeList nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate((_) =>
            $.getStyle(document.querySelectorAll('div'), 'display'))).toBe('block');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate((_) =>
            $.getStyle(document.body.children, 'display'))).toBe('block');
    });

    test('works with array nodes', async ({ page }) => {
        await expect.poll(async () => page.evaluate((_) =>
            $.getStyle([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'display'))).toBe('block');
    });
});
