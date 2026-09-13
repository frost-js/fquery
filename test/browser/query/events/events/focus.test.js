import { focusTests, setup } from '#cases/events/events/focus.js';
import { expect, test } from '#test';

test.describe('QuerySet #focus', () => {
    test.beforeEach(setup);

    focusTests(() => (nodes) => {
        $(nodes).focus();
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.focus();
        })).toBe(true);
    });
});
