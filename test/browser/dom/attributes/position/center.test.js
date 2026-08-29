import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#center', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
                '<div id="test2"></div>';
            window.scrollTo(1000, 1000);
        });
    });

    test('returns the center position of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.center('div'))).toEqual({
            x: 700,
            y: 150,
        });
    });

    test('returns the center position of the first node with offset', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.center('div', { offset: true }))).toEqual({
            x: 1158,
            y: 1150,
        });
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.center('#invalid'))).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.center(
                document.getElementById('test1'),
            ))).toEqual({
            x: 700,
            y: 150,
        });
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.center(
                document.querySelectorAll('div'),
            ))).toEqual({
            x: 700,
            y: 150,
        });
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.center(
                document.body.children,
            ))).toEqual({
            x: 700,
            y: 150,
        });
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.center([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]))).toEqual({
            x: 700,
            y: 150,
        });
    });
});
