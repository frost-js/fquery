import { isEqualTests, setup } from '#cases/utility/tests/is-equal.js';
import { expect, test } from '#test';

test.describe('QuerySet #isEqual', () => {
    test.beforeEach(setup);

    isEqualTests(([nodes, ...args]) => $(nodes).isEqual(...args));

    test('compares forms with a control named isEqualNode', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form><input name="isEqualNode"></form><form><input name="isEqualNode"></form>';
            return $('form').first().isEqual($('form').last());
        })).toBe(true);
    });

    test.describe('source inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const fragment1 = document.createDocumentFragment();
                const fragment2 = document.createDocumentFragment();
                return $(fragment1).isEqual([fragment2]);
            })).toBe(true);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const div1 = document.createElement('div');
                const div2 = document.createElement('div');
                const shadow1 = div1.attachShadow({ mode: 'open' });
                const shadow2 = div2.attachShadow({ mode: 'closed' });
                return $(shadow1).isEqual([shadow2]);
            })).toBe(true);
        });
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet other nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const query = $('#parent2 > span');
                return $('#parent1 span').isEqual(query);
            })).toBe(true);
        });
    });
});
