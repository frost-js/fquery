import { isEqualTests, setup } from '#cases/utility/tests/is-equal.js';
import { expect, test } from '#test';

test.describe('#isEqual', () => {
    test.beforeEach(setup);

    isEqualTests((args) => $.isEqual(...args));

    test('compares forms with a control named isEqualNode', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form><input name="isEqualNode"></form><form><input name="isEqualNode"></form>';
            return $.isEqual(document.querySelector('form'), document.querySelectorAll('form')[1]);
        })).toBe(true);
    });

    test.describe('source inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.isEqual(document.querySelector('#parent1 [data-id="span2"]'), '#parent2 span'))).toBe(true);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.isEqual(document.querySelectorAll('#parent1 span'), '#parent2 span'))).toBe(true);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.isEqual(document.getElementById('parent1').children, '#parent2 span'))).toBe(true);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const fragment1 = document.createDocumentFragment();
                const fragment2 = document.createDocumentFragment();
                return $.isEqual(fragment1, [fragment2]);
            })).toBe(true);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const div1 = document.createElement('div');
                const div2 = document.createElement('div');
                const shadow1 = div1.attachShadow({ mode: 'open' });
                const shadow2 = div2.attachShadow({ mode: 'closed' });
                return $.isEqual(shadow1, [shadow2]);
            })).toBe(true);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.isEqual([
                    document.querySelector('#parent1 > [data-id="span1"]'),
                    document.querySelector('#parent1 > [data-id="span2"]'),
                    document.querySelector('#parent1 > [data-id="span3"]'),
                ], '#parent2 span'))).toBe(true);
        });
    });
});
