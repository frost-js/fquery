import { hasDataTests, setup } from '#cases/utility/tests/has-data.js';
import { expect, test } from '#test';

test.describe('QuerySet #hasData', () => {
    test.beforeEach(setup);

    hasDataTests(([nodes, ...args]) => $(nodes).hasData(...args));

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate(() => {
            const fragment = document.createDocumentFragment();
            $.setData(fragment, 'test', 'Test');
            return $(fragment).hasData();
        })).toBe(true);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate(() => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.setData(shadow, 'test', 'Test');
            return $(shadow).hasData();
        })).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate(() => {
            $.setData(document, 'test', 'Test');
            return $(document).hasData();
        })).toBe(true);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate(() => {
            $.setData(window, 'test', 'Test');
            return $(window).hasData();
        })).toBe(true);
    });
});
