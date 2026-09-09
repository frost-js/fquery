import { setup, toggleClassTests } from '#cases/attributes/styles/toggle-class.js';
import { expect, test } from '#test';

test.describe('QuerySet #toggleClass', () => {
    test.beforeEach(setup);

    toggleClassTests(([nodes, ...args]) => {
        $(nodes).toggleClass(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.toggleClass('test1');
        })).toBe(true);
    });
});
