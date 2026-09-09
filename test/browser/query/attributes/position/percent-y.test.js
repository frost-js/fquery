import { percentYTests, setup } from '#cases/attributes/position/percent-y.js';
import { expect, test } from '#test';

test.describe('QuerySet #percentY', () => {
    test.beforeEach(setup);

    percentYTests(([nodes, ...args]) => $(nodes).percentY(...args));

    test('clamps the returned value between 0 and 100', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return [
                query.percentY(0),
                query.percentY(2000),
            ];
        })).toEqual([
            0,
            100,
        ]);
    });
});
