import { setDataTests, setup } from '#cases/attributes/data/set-data.js';
import { expect, test } from '#test';

test.describe('QuerySet #setData', () => {
    test.beforeEach(setup);

    setDataTests(([nodes, ...args]) => $(nodes).setData(...args));

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.setData('test', 'Test 1');
        })).toBe(true);
    });

    test.describe('node inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const fragment = document.createDocumentFragment();
                $(fragment).setData('test', 'Test 1');
                return $.getData(fragment);
            })).toEqual({
                test: 'Test 1',
            });
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                $(shadow).setData('test', 'Test 1');
                return $.getData(shadow);
            })).toEqual({
                test: 'Test 1',
            });
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $(document).setData('test', 'Test 1');
                return $.getData(document);
            })).toEqual({
                test: 'Test 1',
            });
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $(window).setData('test', 'Test 1');
                return $.getData(window);
            })).toEqual({
                test: 'Test 1',
            });
        });
    });
});
