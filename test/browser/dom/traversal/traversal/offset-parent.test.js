import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="parent1"><div id="child1" style="position: relative;"><span id="span1"><a id="a1"></a></span></div></div><div id="parent2"><div id="child2" style="position: relative;"><span id="span2"><a id="a2"></a></span></div></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#offsetParent', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the offset parent of the first node', async ({ page }) => {
        const id = await page.evaluate((_) => $.offsetParent('a').id);

        expect(id).toBe('child1');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const node = await page.evaluate((_) => $.offsetParent('#invalid'));

        expect(node).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.offsetParent(document.getElementById('a1')).id);

        expect(id).toBe('child1');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.offsetParent(document.querySelectorAll('a')).id);

        expect(id).toBe('child1');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.offsetParent(document.getElementById('span1').children).id);

        expect(id).toBe('child1');
    });

    test('works with array nodes', async ({ page }) => {
        const id = await page.evaluate((_) =>
            $.offsetParent([
                document.getElementById('a1'),
                document.getElementById('a2'),
            ]).id);

        expect(id).toBe('child1');
    });
});
