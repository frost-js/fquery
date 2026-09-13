import { clickTests, setup } from '#cases/events/events/click.js';
import { expect, test } from '#test';

test.describe('QuerySet #click', () => {
    test.beforeEach(setup);

    clickTests(() => (nodes) => {
        $(nodes).click();
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('a');
            return query === query.click();
        })).toBe(true);
    });
});
