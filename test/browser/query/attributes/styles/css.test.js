import { cssTests, setup } from '#cases/attributes/styles/css.js';
import { expect, test } from '#test';

test.describe('QuerySet #css', () => {
    test.beforeEach(setup);

    cssTests(([nodes, ...args]) => $(nodes).css(...args));

    test('returns an object with all computed styles for the first node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const style = $('.test').css();

            return {
                display: style.display,
                width: style.width,
            };
        })).toEqual({
            display: 'block',
            width: '400px',
        });
    });
});
