import { expect, test } from '#test';
import { setupQuery } from '../../../../setup/query.js';

test.describe('#findOne', () => {
    test.beforeEach(setupQuery);

    test.describe('selectors', () => {
        test('finds elements by query selector', async ({ page }) => {
            const id = await page.evaluate(() => $.findOne('#parent1 > #child1 > span, #parent1 > #child2 > span')?.id);

            expect(id).toBe('span1');
        });

        test('finds elements by ID', async ({ page }) => {
            const id = await page.evaluate(() => $.findOne('#parent1')?.id);

            expect(id).toBe('parent1');
        });

        test('finds elements by class name', async ({ page }) => {
            const id = await page.evaluate(() => $.findOne('.span1')?.id);

            expect(id).toBe('span1');
        });

        test('finds elements by tag name', async ({ page }) => {
            const id = await page.evaluate(() => $.findOne('span')?.id);

            expect(id).toBe('span1');
        });
    });

    test.describe('empty results', () => {
        test('returns null for non-matching selector', async ({ page }) => {
            const node = await page.evaluate(() => $.findOne('#invalid'));

            expect(node).toBeNull();
        });

        test('returns undefined for empty nodes', async ({ page }) => {
            const node = await page.evaluate(() => $.findOne('span', '#invalid'));

            expect(node).toBeUndefined();
        });
    });

    test.describe('contexts', () => {
        test('works with query selector nodes', async ({ page }) => {
            const id = await page.evaluate(() => $.findOne('span', '#parent1 > #child2')?.id);

            expect(id).toBe('span3');
        });

        test('works with HTMLElement nodes', async ({ page }) => {
            const id = await page.evaluate(() => $.findOne('span', document.getElementById('child2'))?.id);

            expect(id).toBe('span3');
        });

        test('works with NodeList nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.findOne('span', document.querySelectorAll('#parent2 > div'))?.id,
            );

            expect(id).toBe('span7');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.findOne('span', document.getElementById('parent2').children)?.id,
            );

            expect(id).toBe('span7');
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const id = await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<div id="div1"></div>' +
                    '<div id="div2"></div>');

                return $.findOne('div', fragment)?.id;
            });

            expect(id).toBe('div1');
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const id = await page.evaluate(() => {
                const host = document.createElement('div');
                const shadowRoot = host.attachShadow({ mode: 'open' });
                const fragment = document.createRange().createContextualFragment('<div id="div1"></div>' +
                    '<div id="div2"></div>');

                shadowRoot.appendChild(fragment);

                return $.findOne('div', shadowRoot)?.id;
            });

            expect(id).toBe('div1');
        });

        test('works with Document nodes', async ({ page }) => {
            const id = await page.evaluate(() => {
                const doc = new DOMParser().parseFromString('<html>' +
                    '<head></head>' +
                    '<body>' +
                    '<div id="div1"></div>' +
                    '<div id="div2"></div>' +
                    '</body>' +
                    '</html>', 'text/html');

                return $.findOne('div', doc)?.id;
            });

            expect(id).toBe('div1');
        });

        test('works with array nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.findOne('span', [
                    document.getElementById('child4'),
                    document.getElementById('child5'),
                    document.getElementById('child6'),
                ])?.id,
            );

            expect(id).toBe('span7');
        });
    });
});
