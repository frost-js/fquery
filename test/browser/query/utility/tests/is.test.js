import { isTests, setup } from '#cases/utility/tests/is.js';
import { expect, test } from '#test';

test.describe('QuerySet #is', () => {
    test.beforeEach(setup);

    isTests(([nodes, ...args]) => $(nodes).is(...args));

    test.describe('node inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const fragment = document.createDocumentFragment();
                return $(fragment).is();
            })).toBe(true);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                return $(shadow).is();
            })).toBe(true);
        });
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet filter', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const query = $('div');
                return $('div').is(query);
            })).toBe(true);
        });
    });
});
