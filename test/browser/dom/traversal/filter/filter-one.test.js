import { filterOneTests, setup } from '#cases/traversal/filter/filter-one.js';
import { expect, test } from '#test';

test.describe('#filterOne', () => {
    test.beforeEach(setup);

    test.describe('filter inputs', () => {
        filterOneTests((args) => {
            const node = $.filterOne(...args);
            return node === null ? null : node.id;
        });
    });

    test('returns the first node matching a filter', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.filterOne('div', '[data-filter="test"]').id);

        expect(id).toBe('div2');
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const id = await page.evaluate((_) =>
                $.filterOne(document.getElementById('div2'), '[data-filter="test"]').id);

            expect(id).toBe('div2');
        });

        test('works with NodeList nodes', async ({ page }) => {
            const id = await page.evaluate((_) =>
                $.filterOne(document.querySelectorAll('div'), '[data-filter="test"]').id);

            expect(id).toBe('div2');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const id = await page.evaluate((_) =>
                $.filterOne(document.body.children, '[data-filter="test"]').id);

            expect(id).toBe('div2');
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const id = await page.evaluate((_) => {
                const fragment = document.createDocumentFragment();
                fragment.id = 'fragment';

                return $.filterOne(fragment).id;
            });

            expect(id).toBe('fragment');
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const id = await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                shadow.id = 'shadow';

                return $.filterOne(shadow).id;
            });

            expect(id).toBe('shadow');
        });

        test('works with array nodes', async ({ page }) => {
            const id = await page.evaluate((_) =>
                $.filterOne([
                    document.getElementById('div1'),
                    document.getElementById('div2'),
                    document.getElementById('div3'),
                    document.getElementById('div4'),
                ], '[data-filter="test"]').id);

            expect(id).toBe('div2');
        });
    });
});
