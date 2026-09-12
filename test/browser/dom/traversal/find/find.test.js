import { findTests } from '#cases/traversal/find/find.js';
import { expect, test } from '#test';
import { setupQuery } from '../../../../setup/query.js';

test.describe('#find', () => {
    test.beforeEach(setupQuery);

    findTests((args) => $.find(...args).map((node) => node.id));

    test.describe('empty results', () => {
        test('returns an empty array for non-matching selector', async ({ page }) => {
            const ids = await page.evaluate(() => $.find('#invalid').map((node) => node.id));

            expect(ids).toEqual([]);
        });

        test('returns an empty array for empty nodes', async ({ page }) => {
            const ids = await page.evaluate(() => $.find('span', '#invalid').map((node) => node.id));

            expect(ids).toEqual([]);
        });
    });

    test.describe('contexts', () => {
        test('finds descendants of forms with a control named querySelectorAll', async ({ page }) => {
            const names = await page.evaluate(() => {
                document.body.innerHTML = '<form><input name="querySelectorAll"><input name="test"></form>';
                const nodes = $.find('input[name]', document.querySelector('form'));
                return nodes.map((node) => node.name);
            });

            expect(names).toEqual([
                'querySelectorAll',
                'test',
            ]);
        });

        test('works with query selector nodes', async ({ page }) => {
            const ids = await page.evaluate(() => $.find('span', '#parent1 > #child1').map((node) => node.id));

            expect(ids).toEqual([
                'span1',
                'span2',
            ]);
        });

        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.find('span', document.getElementById('child1')).map((node) => node.id),
            );

            expect(ids).toEqual([
                'span1',
                'span2',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.find('span', document.querySelectorAll('#parent1 > div')).map((node) => node.id),
            );

            expect(ids).toEqual([
                'span1',
                'span2',
                'span3',
                'span4',
                'span5',
                'span6',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.find('span', document.getElementById('parent1').children).map((node) => node.id),
            );

            expect(ids).toEqual([
                'span1',
                'span2',
                'span3',
                'span4',
                'span5',
                'span6',
            ]);
        });

        test('works with collections from another window', async ({ page }) => {
            expect(await page.evaluate(() => {
                const iframe = document.createElement('iframe');
                document.body.appendChild(iframe);

                const context = iframe.contentDocument;
                context.body.innerHTML = '<div><span></span></div>';

                return [
                    $.find('span', context.querySelectorAll('div')).length,
                    $.find('span', context.body.children).length,
                ];
            })).toEqual([1, 1]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const fragment = document.createRange().createContextualFragment('<div id="div1"></div>' +
                    '<div id="div2"></div>');

                return $.find('div', fragment).map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
                'div2',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const host = document.createElement('div');
                const shadowRoot = host.attachShadow({ mode: 'open' });
                const fragment = document.createRange().createContextualFragment('<div id="div1"></div>' +
                    '<div id="div2"></div>');

                shadowRoot.appendChild(fragment);

                return $.find('div', shadowRoot).map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
                'div2',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const doc = new DOMParser().parseFromString('<html>' +
                    '<head></head>' +
                    '<body>' +
                    '<div id="div1"></div>' +
                    '<div id="div2"></div>' +
                    '</body>' +
                    '</html>', 'text/html');

                return $.find('div', doc).map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
                'div2',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.find('span', [
                    document.getElementById('child4'),
                    document.getElementById('child5'),
                    document.getElementById('child6'),
                ]).map((node) => node.id),
            );

            expect(ids).toEqual([
                'span7',
                'span8',
                'span9',
                'span10',
                'span11',
                'span12',
            ]);
        });
    });
});
