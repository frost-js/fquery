import { expect, test } from '#test';
import { setupFindById } from '../../../../setup/find.js';

test.describe('#findById', () => {
    test.beforeEach(setupFindById);

    test.describe('matching', () => {
        test('finds elements by ID', async ({ page }) => {
            const ids = await page.evaluate(() => $.findById('test').map((node) => node.dataset.id));

            expect(ids).toEqual([
                'span1',
                'span3',
                'span5',
                'span7',
            ]);
        });

        test('finds elements with special characters in the ID', async ({ page }) => {
            expect(await page.evaluate(() => {
                const node = document.createElement('div');
                node.id = 'test:1';
                document.body.appendChild(node);

                return $.findById('test:1').length;
            })).toBe(1);
        });
    });

    test.describe('empty results', () => {
        test('returns an empty array for non-matching id', async ({ page }) => {
            const ids = await page.evaluate(() => $.findById('invalid').map((node) => node.dataset.id));

            expect(ids).toEqual([]);
        });

        test('returns an empty array for empty nodes', async ({ page }) => {
            const ids = await page.evaluate(() => $.findById('test', '#invalid').map((node) => node.dataset.id));

            expect(ids).toEqual([]);
        });
    });

    test.describe('contexts', () => {
        test('works with query selector nodes', async ({ page }) => {
            const ids = await page.evaluate(() => $.findById('test', '#parent1').map((node) => node.dataset.id));

            expect(ids).toEqual([
                'span1',
                'span3',
            ]);
        });

        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.findById('test', document.getElementById('parent1')).map((node) => node.dataset.id),
            );

            expect(ids).toEqual([
                'span1',
                'span3',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.findById('test', document.querySelectorAll('#parent1')).map((node) => node.dataset.id),
            );

            expect(ids).toEqual([
                'span1',
                'span3',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.findById('test', document.getElementById('parent1').children).map((node) => node.dataset.id),
            );

            expect(ids).toEqual([
                'span1',
                'span3',
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<div id="test" data-id="div1"></div>' +
                    '<div data-id="div2"></div>' +
                    '<div id="test" data-id="div3"></div>' +
                    '<div data-id="div4"></div>');

                return $.findById('test', fragment).map((node) => node.dataset.id);
            });

            expect(ids).toEqual([
                'div1',
                'div3',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const host = document.createElement('div');
                const shadowRoot = host.attachShadow({ mode: 'open' });
                const fragment = document.createRange().createContextualFragment('<div id="test" data-id="div1"></div>' +
                    '<div data-id="div2"></div>' +
                    '<div id="test" data-id="div3"></div>' +
                    '<div data-id="div4"></div>');

                shadowRoot.appendChild(fragment);

                return $.findById('test', shadowRoot).map((node) => node.dataset.id);
            });

            expect(ids).toEqual([
                'div1',
                'div3',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const doc = new DOMParser().parseFromString('<html>' +
                    '<head></head>' +
                    '<body>' +
                    '<div id="test" data-id="div1"></div>' +
                    '<div data-id="div2"></div>' +
                    '<div id="test" data-id="div3"></div>' +
                    '<div data-id="div4"></div>' +
                    '</body>' +
                    '</html>', 'text/html');

                return $.findById('test', doc).map((node) => node.dataset.id);
            });

            expect(ids).toEqual([
                'div1',
                'div3',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.findById('test', [
                    document.getElementById('child1'),
                    document.getElementById('child2'),
                ]).map((node) => node.dataset.id),
            );

            expect(ids).toEqual([
                'span1',
                'span3',
            ]);
        });
    });
});
