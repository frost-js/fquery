import { blurTests, setup } from '#cases/events/events/blur.js';
import { expect, test } from '#test';

test.describe('QuerySet #blur', () => {
    test.beforeEach(setup);

    blurTests(() => (nodes) => {
        $(nodes).blur();
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            document.getElementById('test1').focus();
            const query = $('input');
            return query === query.blur();
        })).toBe(true);
    });
});
