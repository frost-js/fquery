import { nearestToTests, setup } from '#cases/attributes/position/nearest-to.js';
import { expect, test } from '#test';

test.describe('#nearestTo', () => {
    test.beforeEach(setup);

    nearestToTests((args) => [$.nearestTo(...args).id]);

    test('returns a node centred on the position', async ({ page }) => {
        expect(await page.evaluate(() => {
            const node = document.getElementById('test1');
            const center = $.center(node);

            return $.nearestTo('div', center.x, center.y).id;
        })).toBe('test1');
    });

    test.describe('empty results', () => {
        test('returns undefined for empty nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.nearestTo('#invalid', 1000, 1000))).toBe(undefined);
        });
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const nearest = $.nearestTo(document.getElementById('test1'), 1000, 1000);
                return nearest.id;
            })).toBe('test1');
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const nearest = $.nearestTo(document.querySelectorAll('div'), 1000, 1000);
                return nearest.id;
            })).toBe('test2');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const nearest = $.nearestTo(document.body.children, 1000, 1000);
                return nearest.id;
            })).toBe('test2');
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const nearest = $.nearestTo([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ], 1000, 1000);
                return nearest.id;
            })).toBe('test2');
        });
    });
});
