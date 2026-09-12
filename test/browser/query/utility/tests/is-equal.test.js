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

    test('works with HTMLElement other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#parent1 span').isEqual(document.querySelector('#parent2 > [data-id="span2"]')))).toBe(true);
    });

    test('works with NodeList other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#parent1 span').isEqual(document.querySelectorAll('#parent2 > span')))).toBe(true);
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#parent1 span').isEqual(document.getElementById('parent2').children))).toBe(true);
    });

    test('works with DocumentFragment other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment1 = document.createDocumentFragment();
            const fragment2 = document.createDocumentFragment();
            return $([fragment1]).isEqual(fragment2);
        })).toBe(true);
    });

    test('works with ShadowRoot other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');
            const shadow1 = div1.attachShadow({ mode: 'open' });
            const shadow2 = div2.attachShadow({ mode: 'closed' });
            return $([shadow1]).isEqual(shadow2);
        })).toBe(true);
    });

    test('works with array other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#parent1 span')
                    .isEqual([
                        document.querySelector('#parent2 > [data-id="span2"]'),
                        document.querySelector('#parent2 > [data-id="span3"]'),
                    ]))).toBe(true);
    });

    test('works with QuerySet other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('#parent2 > span');
            return $('#parent1 span').isEqual(query);
        })).toBe(true);
    });
});
