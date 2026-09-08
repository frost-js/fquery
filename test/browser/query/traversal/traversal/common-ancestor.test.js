import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent"><div id="child"><span id="span1"><a id="a1"></a></span><span id="span2"><a id="a2"></a></span></div></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #commonAncestor', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the closest common ancestor of all nodes', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('a').commonAncestor().get().map((node) => node.id));

        expect(ids).toEqual([
            'child',
        ]);
    });

    test('returns the common ancestor within a detached tree', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const parent = document.getElementById('parent');
            parent.remove();

            return $(parent.querySelectorAll('a')).commonAncestor().get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'child',
        ]);
    });

    test('returns an empty QuerySet for nodes in separate detached trees', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const parent1 = document.createElement('div');
            const parent2 = document.createElement('div');
            const node1 = document.createElement('span');
            const node2 = document.createElement('span');

            parent1.appendChild(node1);
            parent2.appendChild(node2);

            return $([node1, node2]).commonAncestor().get().map((node) => node.id);
        });

        expect(ids).toEqual([]);
    });

    test('returns an empty QuerySet when a middle node belongs to another tree', async ({ page }) => {
        const ids = await page.evaluate((_) => {
            const parent1 = document.createElement('div');
            const parent2 = document.createElement('div');
            const node1 = document.createElement('span');
            const node2 = document.createElement('span');
            const node3 = document.createElement('span');

            parent1.appendChild(node1);
            parent2.appendChild(node2);
            parent1.appendChild(node3);

            return $([node1, node2, node3]).commonAncestor().get().map((node) => node.id);
        });

        expect(ids).toEqual([]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('a');
            const query2 = query1.commonAncestor();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });
});
