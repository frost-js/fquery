import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1" class="parent">Test 1<div id="child1"></div>Test 2</div><div id="parent2" class="parent">Test 3<div id="child2"></div>Test 4</div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#contents', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns all children of each node', async ({ page }) => {
        const text = await page.evaluate((_) =>
            $.contents('.parent').map((node) => node.textContent));

        expect(text).toEqual([
            'Test 1',
            '',
            'Test 2',
            'Test 3',
            '',
            'Test 4',
        ]);
    });

    test('returns an empty array for empty nodes', async ({ page }) => {
        const nodes = await page.evaluate((_) => $.contents('#invalid'));

        expect(nodes).toEqual([]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const text = await page.evaluate((_) =>
            $.contents(document.getElementById('parent1')).map((node) => node.textContent));

        expect(text).toEqual([
            'Test 1',
            '',
            'Test 2',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const text = await page.evaluate((_) =>
            $.contents(document.querySelectorAll('.parent')).map((node) => node.textContent));

        expect(text).toEqual([
            'Test 1',
            '',
            'Test 2',
            'Test 3',
            '',
            'Test 4',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const text = await page.evaluate((_) =>
            $.contents(document.body.children).map((node) => node.textContent));

        expect(text).toEqual([
            'Test 1',
            '',
            'Test 2',
            'Test 3',
            '',
            'Test 4',
        ]);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const text = await page.evaluate((_) => {
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                'Test 1<div id="child1"></div>Test 2',
            );

            return $.contents(fragment).map((node) => node.textContent);
        });

        expect(text).toEqual([
            'Test 1',
            '',
            'Test 2',
        ]);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const text = await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                'Test 1<div id="child1"></div>Test 2',
            );
            shadow.appendChild(fragment);

            return $.contents(shadow).map((node) => node.textContent);
        });

        expect(text).toEqual([
            'Test 1',
            '',
            'Test 2',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.contents(document).map((node) => node.id));

        expect(ids).toEqual([
            'html',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        const text = await page.evaluate((_) =>
            $.contents([
                document.getElementById('parent1'),
                document.getElementById('parent2'),
            ]).map((node) => node.textContent));

        expect(text).toEqual([
            'Test 1',
            '',
            'Test 2',
            'Test 3',
            '',
            'Test 4',
        ]);
    });
});
