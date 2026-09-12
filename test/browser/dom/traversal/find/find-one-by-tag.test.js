import { expect, test } from '#test';
import { setupFindByTag } from '../../../../setup/find.js';

test.describe('#findOneByTag', () => {
    test.beforeEach(setupFindByTag);

    test.describe('matching', () => {
        test('finds elements by tag name', async ({ page }) => {
            const id = await page.evaluate(() => $.findOneByTag('span')?.id);

            expect(id).toBe('span1');
        });
    });

    test.describe('empty results', () => {
        test('returns null for non-matching tag', async ({ page }) => {
            const node = await page.evaluate(() => $.findOneByTag('invalid'));

            expect(node).toBeNull();
        });

        test('returns undefined for empty nodes', async ({ page }) => {
            const node = await page.evaluate(() => $.findOneByTag('span', '#invalid'));

            expect(node).toBeUndefined();
        });
    });

    test.describe('contexts', () => {
        test('works with query selector nodes', async ({ page }) => {
            const id = await page.evaluate(() => $.findOneByTag('span', '#parent2')?.id);

            expect(id).toBe('span5');
        });

        test('works with HTMLElement nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.findOneByTag('span', document.getElementById('parent2'))?.id,
            );

            expect(id).toBe('span5');
        });

        test('works with NodeList nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.findOneByTag('span', document.querySelectorAll('#parent2'))?.id,
            );

            expect(id).toBe('span5');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.findOneByTag('span', document.getElementById('parent2').children)?.id,
            );

            expect(id).toBe('span5');
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const id = await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<div id="div1"></div>' +
                    '<div id="div2"></div>' +
                    '<span id="span1"></span>' +
                    '<span id="span2"></span>');

                return $.findOneByTag('span', fragment)?.id;
            });

            expect(id).toBe('span1');
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const id = await page.evaluate(() => {
                const host = document.createElement('div');
                const shadowRoot = host.attachShadow({ mode: 'open' });
                const fragment = document.createRange().createContextualFragment('<div id="div1"></div>' +
                    '<div id="div2"></div>' +
                    '<span id="span1"></span>' +
                    '<span id="span2"></span>');

                shadowRoot.appendChild(fragment);

                return $.findOneByTag('span', shadowRoot)?.id;
            });

            expect(id).toBe('span1');
        });

        test('works with Document nodes', async ({ page }) => {
            const id = await page.evaluate(() => {
                const doc = new DOMParser().parseFromString('<html>' +
                    '<head></head>' +
                    '<body>' +
                    '<div id="div1"></div>' +
                    '<div id="div2"></div>' +
                    '<span id="span1"></span>' +
                    '<span id="span2"></span>' +
                    '</body>' +
                    '</html>', 'text/html');

                return $.findOneByTag('span', doc)?.id;
            });

            expect(id).toBe('span1');
        });

        test('works with array nodes', async ({ page }) => {
            const id = await page.evaluate(() =>
                $.findOneByTag('span', [
                    document.getElementById('child3'),
                    document.getElementById('child4'),
                ])?.id,
            );

            expect(id).toBe('span5');
        });
    });
});
