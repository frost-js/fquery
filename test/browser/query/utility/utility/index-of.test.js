import { indexOfTests, setup } from '#cases/utility/utility/index-of.js';
import { expect, test } from '#test';

test.describe('QuerySet #indexOf', () => {
    test.beforeEach(setup);

    indexOfTests(([nodes, ...args]) => $(nodes).indexOf(...args));

    test.describe('node inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const fragment = document.createDocumentFragment();
                return $(fragment).indexOf();
            })).toBe(0);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                return $(shadow).indexOf();
            })).toBe(0);
        });
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet filter', async ({ page }) => {
            expect(await page.evaluate(() => {
                const query = $('.test');
                return $('div').indexOf(query);
            })).toBe(1);
        });
    });
});
