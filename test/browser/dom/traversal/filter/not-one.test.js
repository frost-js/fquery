import { notOneTests, setup } from '#cases/traversal/filter/not-one.js';
import { expect, test } from '#test';

test.describe('#notOne', () => {
    test.beforeEach(setup);

    test.describe('filter inputs', () => {
        notOneTests((args) => [$.notOne(...args).id]);

        test('works with HTMLCollection filter', async ({ page }) => {
            const node = await page.evaluate(() =>
                $.notOne('div', document.body.children));

            expect(node).toBe(null);
        });

        test('works with DocumentFragment filter', async ({ page }) => {
            const node = await page.evaluate(() => {
                const fragment = document.createDocumentFragment();
                fragment.id = 'fragment';

                return $.notOne([fragment], fragment);
            });

            expect(node).toBe(null);
        });

        test('works with ShadowRoot filter', async ({ page }) => {
            const node = await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                shadow.id = 'shadow';

                return $.notOne([shadow], shadow);
            });

            expect(node).toBe(null);
        });
    });

    test('returns the first node not matching a filter', async ({ page }) => {
        const id = await page.evaluate(() =>
            $.notOne('div', '[data-filter="test"]').id);

        expect(id).toBe('div2');
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.notOne(document.getElementById('div2'), '[data-filter="test"]').id);

            expect(id).toBe('div2');
        });

        test('works with NodeList nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.notOne(document.querySelectorAll('div'), '[data-filter="test"]').id);

            expect(id).toBe('div2');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.notOne(document.body.children, '[data-filter="test"]').id);

            expect(id).toBe('div2');
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const id = await page.evaluate(() => {
                const fragment = document.createDocumentFragment();
                fragment.id = 'fragment';

                return $.notOne(fragment, '[data-filter="test"]').id;
            });

            expect(id).toBe('fragment');
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const id = await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                shadow.id = 'shadow';

                return $.notOne(shadow, '[data-filter="test"]').id;
            });

            expect(id).toBe('shadow');
        });

        test('works with array nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.notOne([
                    document.getElementById('div1'),
                    document.getElementById('div2'),
                    document.getElementById('div3'),
                    document.getElementById('div4'),
                ], '[data-filter="test"]').id);

            expect(id).toBe('div2');
        });
    });
});
