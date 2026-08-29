import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="div1"></div><div id="div2"></div><div id="div3"></div><div id="div4"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#withAnimation', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
        await page.evaluate((_) => {
            $.fadeIn('#div1');
            $.fadeIn('#div3');
        });
    });

    test('returns nodes with animations', async ({ page }) => {
        await expect.poll(async () =>
            page.evaluate((_) => $.withAnimation('div').map((node) => node.id))).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await expect.poll(async () =>
            page.evaluate((_) => $.withAnimation(document.getElementById('div1')).map((node) => node.id))).toEqual([
            'div1',
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        await expect.poll(async () =>
            page.evaluate((_) => $.withAnimation(document.querySelectorAll('div')).map((node) => node.id))).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await expect.poll(async () =>
            page.evaluate((_) => $.withAnimation(document.body.children).map((node) => node.id))).toEqual([
            'div1',
            'div3',
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        await expect.poll(async () =>
            page.evaluate((_) => $.withAnimation([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]).map((node) => node.id))).toEqual([
            'div1',
            'div3',
        ]);
    });
});
