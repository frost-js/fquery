import { nearestToTests, setup } from '#cases/attributes/position/nearest-to.js';
import { expect, test } from '#test';

test.describe('QuerySet #nearestTo', () => {
    test.beforeEach(setup);

    nearestToTests(([nodes, ...args]) => $(nodes).nearestTo(...args).get().map((node) => node.id));

    test.describe('empty results', () => {
        test('returns an empty QuerySet for empty nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#invalid')
                        .nearestTo(1000, 1000)
                        .get())).toEqual([]);
        });
    });

    test('returns a new QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.nearestTo(1000, 1000);
            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        })).toBe(true);
    });
});
