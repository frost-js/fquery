import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1" class="parent">Test 1<div id="child1"></div>Test 2</div><div id="parent2" class="parent">Test 3<div id="child2"></div>Test 4</div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #contents', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns all children of each node', async ({ page }) => {
        const text = await page.evaluate((_) =>
            $('.parent').contents().get().map((node) => node.textContent));

        expect(text).toEqual([
            'Test 1',
            '',
            'Test 2',
            'Test 3',
            '',
            'Test 4',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('.parent');
            const query2 = query1.contents();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const text = await page.evaluate((_) => {
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                'Test 1<div id="child1"></div>Test 2',
            );

            return $(fragment).contents().get().map((node) => node.textContent);
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

            return $(shadow).contents().get().map((node) => node.textContent);
        });

        expect(text).toEqual([
            'Test 1',
            '',
            'Test 2',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $(document).contents().get().map((node) => node.id));

        expect(ids).toEqual([
            'html',
        ]);
    });
});
