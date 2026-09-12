import { expect, test } from '#test';
import { setupQuery } from '../../setup/query.js';

test.describe('#queryOne', () => {
    test.beforeEach(setupQuery);

    test.describe('selectors', () => {
        test('finds elements by query selector', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.queryOne('#parent1 > #child1 > span, #parent1 > #child2 > span')
                        .get()
                        .map((node) => node.id))).toEqual([
                'span1',
            ]);
        });

        test('finds elements by ID', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.queryOne('#parent1')
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
            ]);
        });

        test('finds elements by class name', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.queryOne('.span1')
                        .get()
                        .map((node) => node.id))).toEqual([
                'span1',
            ]);
        });

        test('finds elements by tag name', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.queryOne('span')
                        .get()
                        .map((node) => node.id))).toEqual([
                'span1',
            ]);
        });
    });

    test('returns a QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.queryOne('div').constructor.name)).toBe('QuerySet');
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.queryOne(document.getElementById('child1')).get().map((node) => node.id))).toEqual([
                'child1',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.queryOne(document.querySelectorAll('#parent1 > div')).get().map((node) => node.id))).toEqual([
                'child1',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.queryOne(document.getElementById('parent1').children).get().map((node) => node.id))).toEqual([
                'child1',
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const range = document.createRange();
                const fragment = range.createContextualFragment('');
                fragment.id = 'fragment';
                return $.queryOne(fragment)
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'fragment',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                shadow.id = 'shadow';
                return $.queryOne(shadow)
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'shadow',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.queryOne(document)
                        .get()
                        .map((node) => node.id))).toEqual([
                'document',
            ]);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.queryOne(window)
                        .get()
                        .map((node) => node.id))).toEqual([
                'window',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.queryOne([
                    document.getElementById('child1'),
                    document.getElementById('child2'),
                    document.getElementById('child3'),
                ]).get().map((node) => node.id))).toEqual([
                'child1',
            ]);
        });

        test('works with QuerySet nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const query = $('#parent1 > #child1 > span, #parent1 > #child2 > span');
                return $.queryOne(query)
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'span1',
            ]);
        });
    });

    test.describe('contexts', () => {
        test('works with HTMLElement context', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.queryOne('span', document.getElementById('child1')).get().map((node) => node.id))).toEqual([
                'span1',
            ]);
        });

        test('works with NodeList context', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.queryOne('span', document.querySelectorAll('#parent1 > div')).get().map((node) => node.id))).toEqual([
                'span1',
            ]);
        });

        test('works with HTMLCollection context', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.queryOne('span', document.getElementById('parent1').children).get().map((node) => node.id))).toEqual([
                'span1',
            ]);
        });

        test('works with DocumentFragment context', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div id="div1"></div>' +
                        '<div id="div2"></div>',
                );
                return $.queryOne('div', fragment)
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'div1',
            ]);
        });

        test('works with ShadowRoot context', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div id="div1"></div>' +
                        '<div id="div2"></div>',
                );
                shadow.appendChild(fragment);
                return $.queryOne('div', shadow)
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'div1',
            ]);
        });

        test('works with Document context', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const parser = new DOMParser();
                const myDoc = parser.parseFromString(
                    '<html>' +
                        '<head>' +
                        '</head>' +
                        '<body>' +
                        '<div id="div1"></div>' +
                        '<div id="div2"></div>' +
                        '</body>' +
                        '</html>',
                    'text/html',
                );
                return $.queryOne('div', myDoc)
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'div1',
            ]);
        });

        test('works with array context', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $.queryOne('span', [
                    document.getElementById('child1'),
                    document.getElementById('child2'),
                    document.getElementById('child3'),
                ]).get().map((node) => node.id))).toEqual([
                'span1',
            ]);
        });

        test('works with QuerySet context', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const query = $.query('#parent1 > div');
                return $.queryOne('span', query)
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'span1',
            ]);
        });
    });
});
