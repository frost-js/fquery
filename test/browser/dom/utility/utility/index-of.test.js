import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#indexOf', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1"></div>' +
                '<div id="div2" class="test"></div>' +
                '<div id="div3"></div>' +
                '<div id="div4" class="test"></div>';
        });
    });

    test('returns the index of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.indexOf('div'))).toBe(0);
    });

    test('returns the index of the first node matching a filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.indexOf('div', '.test'))).toBe(1);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.indexOf(
                document.getElementById('div2'),
                '.test',
            ))).toBe(0);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.indexOf(
                document.querySelectorAll('div'),
                '.test',
            ))).toBe(1);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.indexOf(
                document.body.children,
                '.test',
            ))).toBe(1);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            return $.indexOf(fragment);
        })).toBe(0);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            return $.indexOf(shadow);
        })).toBe(0);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.indexOf([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ], '.test'))).toBe(1);
    });

    test('works with function filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.indexOf(
                'div',
                (node) => node.id === 'div2',
            ))).toBe(1);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.indexOf(
                'div',
                document.getElementById('div2'),
            ))).toBe(1);
    });

    test('works with NodeList filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.indexOf(
                'div',
                document.querySelectorAll('.test'),
            ))).toBe(1);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.indexOf(
                'div',
                document.body.children,
            ))).toBe(0);
    });

    test('works with DocumentFragment filter', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            return $.indexOf(
                [
                    document.getElementById('div2'),
                    document.getElementById('div4'),
                    fragment,
                ],
                fragment,
            );
        })).toBe(2);
    });

    test('works with ShadowRoot filter', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            return $.indexOf(
                [
                    document.getElementById('div2'),
                    document.getElementById('div4'),
                    shadow,
                ],
                shadow,
            );
        })).toBe(2);
    });

    test('works with array filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.indexOf('div', [
                document.getElementById('div2'),
                document.getElementById('div4'),
            ]))).toBe(1);
    });
});
