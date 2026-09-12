import { setup, toggleTests } from '#cases/attributes/styles/toggle.js';
import { expect, test } from '#test';

test.describe('QuerySet #toggle', () => {
    test.beforeEach(setup);

    toggleTests(([nodes, ...args]) => {
        $(nodes).toggle(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.toggle();
        })).toBe(true);
    });
});
