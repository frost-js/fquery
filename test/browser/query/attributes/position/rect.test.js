import { rectTests, setup } from '#cases/attributes/position/rect.js';
import { expect, test } from '#test';

test.describe('QuerySet #rect', () => {
    test.beforeEach(setup);

    rectTests(([nodes, ...args]) => $(nodes).rect(...args) .toJSON());

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#invalid').rect())).toBe(undefined);
    });
});
