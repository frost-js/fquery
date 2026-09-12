import { setup, setValueTests } from '#cases/attributes/attributes/set-value.js';
import { expect, test } from '#test';

test.describe('QuerySet #setValue', () => {
    test.beforeEach(setup);

    setValueTests(([nodes, ...args]) => {
        $(nodes).setValue(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('input');
            return query === query.setValue('Test');
        })).toBe(true);
    });
});
