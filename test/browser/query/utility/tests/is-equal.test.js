import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #isEqual', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="parent1">' +
                '<span data-id="span1"></span>' +
                '<span data-id="span2"></span>' +
                '<span data-id="span3"></span>' +
                '</div>' +
                '<div id="parent2">' +
                '<span data-id="span2"></span>' +
                '<span data-id="span3"></span>' +
                '<span data-id="span4"></span>' +
                '</div>' +
                '<div id="parent3">' +
                '<a data-id="a1"></a>' +
                '<a data-id="a2"></a>' +
                '<a data-id="a3"></a>' +
                '</div>';
        });
    });

    test('returns true if any node is equal to any other node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#parent1 span')
                    .isEqual('#parent2 span'))).toBe(true);
    });

    test('returns false if no nodes are equal to any other node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#parent1 span')
                    .isEqual('#parent3 a'))).toBe(false);
    });

    test('works with shallow option', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#parent1 span')
                    .isEqual('#parent2 span', { shallow: true }))).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment1 = document.createDocumentFragment();
            const fragment2 = document.createDocumentFragment();
            return $(fragment1)
                    .isEqual([fragment2]);
        })).toBe(true);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');
            const shadow1 = div1.attachShadow({ mode: 'open' });
            const shadow2 = div2.attachShadow({ mode: 'closed' });
            return $(shadow1)
                    .isEqual([shadow2]);
        })).toBe(true);
    });

    test('works with HTMLElement other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#parent1 span')
                    .isEqual(
                        document.querySelector('#parent2 > [data-id="span2"]'),
                    ))).toBe(true);
    });

    test('works with NodeList other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#parent1 span')
                    .isEqual(
                        document.querySelectorAll('#parent2 > span'),
                    ))).toBe(true);
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#parent1 span')
                    .isEqual(
                        document.getElementById('parent2').children,
                    ))).toBe(true);
    });

    test('works with DocumentFragment other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment1 = document.createDocumentFragment();
            const fragment2 = document.createDocumentFragment();
            return $([fragment1])
                    .isEqual(fragment2);
        })).toBe(true);
    });

    test('works with ShadowRoot other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');
            const shadow1 = div1.attachShadow({ mode: 'open' });
            const shadow2 = div2.attachShadow({ mode: 'closed' });
            return $([shadow1])
                    .isEqual(shadow2);
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
            return $('#parent1 span')
                    .isEqual(query);
        })).toBe(true);
    });
});
