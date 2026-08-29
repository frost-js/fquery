import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#position', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="parent" style="position: relative; margin: 1050px; padding: 25px 50px;">' +
                '<div id="test1" data-toggle="child" style="display: block; width: 100px; height: 100px; padding: 50px;"></div>' +
                '<div id="test2" data-toggle="child"></div>';
            window.scrollTo(1000, 1000);
        });
    });

    test('returns the position of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.position('[data-toggle="child"]'))).toEqual({
            x: 50,
            y: 25,
        });
    });

    test('returns the position of the first node with offset', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.position('[data-toggle="child"]', { offset: true }))).toEqual({
            x: 1108,
            y: 1075,
        });
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.position('#invalid'))).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.position(
                document.getElementById('test1'),
            ))).toEqual({
            x: 50,
            y: 25,
        });
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.position(
                document.querySelectorAll('[data-toggle="child"]'),
            ))).toEqual({
            x: 50,
            y: 25,
        });
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.position(
                document.getElementById('parent').children,
            ))).toEqual({
            x: 50,
            y: 25,
        });
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.position([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]))).toEqual({
            x: 50,
            y: 25,
        });
    });
});
