import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="div1" data-filter="test"></div><div id="div2"></div><div id="div3" data-filter="test"></div><div id="div4"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#notOne', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the first node not matching a filter', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.notOne('div', '[data-filter="test"]').id);

        expect(id).toBe('div2');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.notOne(document.getElementById('div2'), '[data-filter="test"]').id);

        expect(id).toBe('div2');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.notOne(document.querySelectorAll('div'), '[data-filter="test"]').id);

        expect(id).toBe('div2');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.notOne(document.body.children, '[data-filter="test"]').id);

        expect(id).toBe('div2');
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const id = await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            fragment.id = 'fragment';

            return $.notOne(fragment, '[data-filter="test"]').id;
        });

        expect(id).toBe('fragment');
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const id = await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            shadow.id = 'shadow';

            return $.notOne(shadow, '[data-filter="test"]').id;
        });

        expect(id).toBe('shadow');
    });

    test('works with array nodes', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.notOne([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ], '[data-filter="test"]').id);

        expect(id).toBe('div2');
    });

    test('works with function filter', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.notOne('div', (node) => node.dataset.filter === 'test').id);

        expect(id).toBe('div2');
    });

    test('works with HTMLElement filter', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.notOne('div', document.getElementById('div1')).id);

        expect(id).toBe('div2');
    });

    test('works with NodeList filter', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.notOne('div', document.querySelectorAll('[data-filter="test"]')).id);

        expect(id).toBe('div2');
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        const node = await page.evaluate((_) =>
            $.notOne('div', document.body.children));

        expect(node).toBe(null);
    });

    test('works with DocumentFragment filter', async ({ page }) => {
        const node = await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            fragment.id = 'fragment';

            return $.notOne([fragment], fragment);
        });

        expect(node).toBe(null);
    });

    test('works with ShadowRoot filter', async ({ page }) => {
        const node = await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            shadow.id = 'shadow';

            return $.notOne([shadow], shadow);
        });

        expect(node).toBe(null);
    });

    test('works with array filter', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.notOne('div', [
                document.getElementById('div1'),
                document.getElementById('div3'),
            ]).id);

        expect(id).toBe('div2');
    });
});
