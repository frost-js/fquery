import { isSameTests, setup } from '#cases/utility/tests/is-same.js';
import { expect, test } from '#test';

test.describe('QuerySet #isSame', () => {
    test.beforeEach(setup);

    isSameTests(([nodes, ...args]) => $(nodes).isSame(...args));

    test.describe('source inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const fragment = document.createDocumentFragment();
                return $(fragment).isSame([fragment]);
            })).toBe(true);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                return $(shadow).isSame([shadow]);
            })).toBe(true);
        });
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet other nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const query = $('#div2, #div4');
                return $('div').isSame(query);
            })).toBe(true);
        });
    });
});
