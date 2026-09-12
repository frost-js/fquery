import { expect, test } from '#test';
import { setupFindByClass } from '../../../../setup/find.js';

test.describe('#findOneByClass', () => {
    test.beforeEach(setupFindByClass);

    test.describe('matching', () => {
        test('finds elements by class name', async ({ page }) => {
            const id = await page.evaluate(() => $.findOneByClass('test')?.id);

            expect(id).toBe('span1');
        });
    });

    test.describe('empty results', () => {
        test('returns null for non-matching class', async ({ page }) => {
            const node = await page.evaluate(() => $.findOneByClass('invalid'));

            expect(node).toBeNull();
        });

        test('returns undefined for empty nodes', async ({ page }) => {
            const node = await page.evaluate(() => $.findOneByClass('test', '#invalid'));

            expect(node).toBeUndefined();
        });
    });

    test.describe('contexts', () => {
        test('works with query selector nodes', async ({ page }) => {
            const id = await page.evaluate(() => $.findOneByClass('test', '#parent2')?.id);

            expect(id).toBe('span5');
        });

        test('works with HTMLElement nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.findOneByClass('test', document.getElementById('parent2'))?.id,
            );

            expect(id).toBe('span5');
        });

        test('works with NodeList nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.findOneByClass('test', document.querySelectorAll('#parent2'))?.id,
            );

            expect(id).toBe('span5');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.findOneByClass('test', document.getElementById('parent2').children)?.id,
            );

            expect(id).toBe('span5');
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const id = await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<div id="div1" class="test"></div>' +
                    '<div id="div2"></div>' +
                    '<div id="div3" class="test"></div>' +
                    '<div id="div4"></div>');

                return $.findOneByClass('test', fragment)?.id;
            });

            expect(id).toBe('div1');
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const id = await page.evaluate(() => {
                const host = document.createElement('div');
                const shadowRoot = host.attachShadow({ mode: 'open' });
                const fragment = document.createRange().createContextualFragment('<div id="div1" class="test"></div>' +
                    '<div id="div2"></div>' +
                    '<div id="div3" class="test"></div>' +
                    '<div id="div4"></div>');

                shadowRoot.appendChild(fragment);

                return $.findOneByClass('test', shadowRoot)?.id;
            });

            expect(id).toBe('div1');
        });

        test('works with Document nodes', async ({ page }) => {
            const id = await page.evaluate(() => {
                const doc = new DOMParser().parseFromString('<html>' +
                    '<head></head>' +
                    '<body>' +
                    '<div id="div1" class="test"></div>' +
                    '<div id="div2"></div>' +
                    '<div id="div3" class="test"></div>' +
                    '<div id="div4"></div>' +
                    '</body>' +
                    '</html>', 'text/html');

                return $.findOneByClass('test', doc)?.id;
            });

            expect(id).toBe('div1');
        });

        test('works with array nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.findOneByClass('test', [
                    document.getElementById('child3'),
                    document.getElementById('child4'),
                ])?.id,
            );

            expect(id).toBe('span5');
        });
    });
});
