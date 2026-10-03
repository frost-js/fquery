import { nearestToNodeTests, setup } from '#cases/attributes/position/nearest-to-node.js';
import { expect, test } from '#test';

test.describe('QuerySet #nearestToNode', () => {
    test.beforeEach(setup);

    nearestToNodeTests(([nodes, ...args]) => $(nodes).nearestToNode(...args).get().map((node) => node.id));

    test.describe('empty results', () => {
        test('returns an empty QuerySet for empty nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $('#invalid')
                        .nearestToNode('[data-toggle="to"]')
                        .get())).toEqual([]);
        });

        test('returns an empty QuerySet for empty other nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $('[data-toggle="from"]')
                        .nearestToNode('#invalid')
                        .get())).toEqual([]);
        });
    });

    test('returns a new QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query1 = $('div');
            const query2 = query1.nearestToNode('[data-toggle="to"]');
            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        })).toBe(true);
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet other nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const query = $('[data-toggle="to"]');
                return $('[data-toggle="from"]')
                        .nearestToNode(query)
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'test2',
            ]);
        });
    });
});
