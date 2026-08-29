import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#nearestTo', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
                '<div id="test2" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>';
            window.scrollTo(1000, 1000);
        });
    });

    test('returns the nearest node to a position', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const nearest = $.nearestTo('div', 1000, 1000);
            return nearest.id;
        })).toBe('test2');
    });

    test('returns a node centred on the position', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = document.getElementById('test1');
            const center = $.center(node);

            return $.nearestTo('div', center.x, center.y).id;
        })).toBe('test1');
    });

    test('returns the nearest node to a position with offset', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const nearest = $.nearestTo('div', 1000, 1000, { offset: true });
            return nearest.id;
        })).toBe('test1');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.nearestTo('#invalid', 1000, 1000))).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const nearest = $.nearestTo(
                document.getElementById('test1'),
                1000,
                1000,
            );
            return nearest.id;
        })).toBe('test1');
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const nearest = $.nearestTo(
                document.querySelectorAll('div'),
                1000,
                1000,
            );
            return nearest.id;
        })).toBe('test2');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const nearest = $.nearestTo(
                document.body.children,
                1000,
                1000,
            );
            return nearest.id;
        })).toBe('test2');
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const nearest = $.nearestTo([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 1000, 1000);
            return nearest.id;
        })).toBe('test2');
    });
});
