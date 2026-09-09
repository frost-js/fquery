import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent"><div id="child"><span id="span1"><a id="a1"></a></span><span id="span2"><a id="a2"></a></span></div></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#commonAncestor', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the closest common ancestor of all nodes', async ({ page }) => {
        const id = await page.evaluate((_) => $.commonAncestor('a').id);

        expect(id).toBe('child');
    });

    test('returns the parent when a node and its descendant are selected', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.commonAncestor([
                document.getElementById('a1'),
                document.getElementById('span1'),
            ]).id);

        expect(id).toBe('child');
    });

    test('returns the common ancestor within a detached tree', async ({ page }) => {
        const id = await page.evaluate((_) => {
            const parent = document.getElementById('parent');
            parent.remove();

            return $.commonAncestor(parent.querySelectorAll('a')).id;
        });

        expect(id).toBe('child');
    });

    test('returns the common ancestor for reversed nodes within a detached tree', async ({ page }) => {
        const id = await page.evaluate((_) => {
            const parent = document.getElementById('parent');
            const node1 = document.getElementById('a1');
            const node2 = document.getElementById('a2');
            parent.remove();

            return $.commonAncestor([node2, node1]).id;
        });

        expect(id).toBe('child');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const ancestor = await page.evaluate((_) => $.commonAncestor('#invalid'));

        expect(ancestor).toBe(undefined);
    });

    test('returns undefined for nodes in separate detached trees', async ({ page }) => {
        const ancestor = await page.evaluate((_) => {
            const parent1 = document.createElement('div');
            const parent2 = document.createElement('div');
            const node1 = document.createElement('span');
            const node2 = document.createElement('span');

            parent1.appendChild(node1);
            parent2.appendChild(node2);

            return $.commonAncestor([node1, node2]);
        });

        expect(ancestor).toBe(undefined);
    });

    test('returns undefined when a middle node belongs to another tree', async ({ page }) => {
        const ancestor = await page.evaluate((_) => {
            const parent1 = document.createElement('div');
            const parent2 = document.createElement('div');
            const node1 = document.createElement('span');
            const node2 = document.createElement('span');
            const node3 = document.createElement('span');

            parent1.appendChild(node1);
            parent2.appendChild(node2);
            parent1.appendChild(node3);

            return $.commonAncestor([node1, node2, node3]);
        });

        expect(ancestor).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.commonAncestor(document.getElementById('a1')).id);

        expect(id).toBe('span1');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.commonAncestor(document.querySelectorAll('a')).id);

        expect(id).toBe('child');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.commonAncestor(document.getElementById('span1').children).id);

        expect(id).toBe('span1');
    });

    test('works with array nodes', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.commonAncestor([
                document.getElementById('a1'),
                document.getElementById('a2'),
            ]).id);

        expect(id).toBe('child');
    });
});
