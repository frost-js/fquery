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

    test('returns undefined for empty nodes', async ({ page }) => {
        const ancestor = await page.evaluate((_) => $.commonAncestor('#invalid'));

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
