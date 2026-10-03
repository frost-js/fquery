import { percentXTests, setup } from '#cases/attributes/position/percent-x.js';
import { expect, test } from '#test';

test.describe('QuerySet #percentX', () => {
    test.beforeEach(setup);

    percentXTests(([nodes, ...args]) => $(nodes).percentX(...args));

    test('clamps the returned value between 0 and 100', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query = $('div');
            return [
                query.percentX(0),
                query.percentX(2000),
            ];
        })).toEqual([
            0,
            100,
        ]);
    });
});
