import { expect, test } from '#test';
import { setupQuery } from '../../../../setup/query.js';

test.describe('QuerySet #add', () => {
    test.beforeEach(setupQuery);

    test.describe('selectors', () => {
        test('adds elements by query selector', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent1')
                        .add('#parent1 > #child1 > span, #parent1 > #child2 > span')
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
                'span1',
                'span2',
                'span3',
                'span4',
            ]);
        });

        test('adds elements by ID', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent1')
                        .add('#parent2')
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
                'parent2',
            ]);
        });

        test('adds elements by class name', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent1')
                        .add('.span1')
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
                'span1',
                'span2',
                'span3',
                'span4',
                'span5',
                'span6',
            ]);
        });

        test('adds elements by tag name', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent1')
                        .add('span')
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
                'span1',
                'span2',
                'span3',
                'span4',
                'span5',
                'span6',
                'span7',
                'span8',
                'span9',
                'span10',
                'span11',
                'span12',
            ]);
        });
    });

    test.describe('result set', () => {
        test('sorts the new set', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent2')
                        .add('#parent1')
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
                'parent2',
            ]);
        });

        test('removes duplicate nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent1')
                        .add('#parent1')
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
            ]);
        });

        test('returns a new QuerySet', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const query1 = $('#parent1');
                const query2 = query1.add('div');
                return query2.constructor.name === 'QuerySet' && query1 !== query2;
            })).toBe(true);
        });
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent1')
                        .add(document.getElementById('child1'))
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
                'child1',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent1')
                        .add(document.querySelectorAll('#parent1 > div'))
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
                'child1',
                'child2',
                'child3',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent1')
                        .add(document.getElementById('parent1').children)
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
                'child1',
                'child2',
                'child3',
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const range = document.createRange();
                const fragment = range.createContextualFragment('');
                fragment.id = 'fragment';
                return $('#parent1')
                        .add(fragment)
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'fragment',
                'parent1',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                shadow.id = 'shadow';
                return $('#parent1')
                        .add(shadow)
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'parent1',
                'shadow',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent1')
                        .add(document)
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
                'document',
            ]);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent1')
                        .add(window)
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
                'window',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent1')
                        .add([
                            document.getElementById('child1'),
                            document.getElementById('child2'),
                            document.getElementById('child3'),
                        ]).get().map((node) => node.id))).toEqual([
                'parent1',
                'child1',
                'child2',
                'child3',
            ]);
        });

        test('works with QuerySet nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const query = $('#parent1 > #child1 > span, #parent1 > #child2 > span');
                return $('#parent1')
                        .add(query)
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'parent1',
                'span1',
                'span2',
                'span3',
                'span4',
            ]);
        });
    });

    test.describe('contexts', () => {
        test('works with HTMLElement context', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent1')
                        .add('span', document.getElementById('child1'))
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
                'span1',
                'span2',
            ]);
        });

        test('works with NodeList context', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent1')
                        .add('span', document.querySelectorAll('#parent1 > div'))
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
                'span1',
                'span2',
                'span3',
                'span4',
                'span5',
                'span6',
            ]);
        });

        test('works with HTMLCollection context', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent1')
                        .add('span', document.getElementById('parent1').children)
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
                'span1',
                'span2',
                'span3',
                'span4',
                'span5',
                'span6',
            ]);
        });

        test('works with DocumentFragment context', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div id="div1"></div>' +
                        '<div id="div2"></div>',
                );
                return $('')
                        .add('div', fragment)
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'div1',
                'div2',
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
                return $('')
                        .add('div', shadow)
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'div1',
                'div2',
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
                return $('')
                        .add('div', myDoc)
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'div1',
                'div2',
            ]);
        });

        test('works with array context', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#parent1')
                        .add('span', [
                            document.getElementById('child1'),
                            document.getElementById('child2'),
                            document.getElementById('child3'),
                        ])
                        .get()
                        .map((node) => node.id))).toEqual([
                'parent1',
                'span1',
                'span2',
                'span3',
                'span4',
                'span5',
                'span6',
            ]);
        });

        test('works with QuerySet context', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const query = $('#parent1 > div');
                return $('#parent1')
                        .add('span', query)
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'parent1',
                'span1',
                'span2',
                'span3',
                'span4',
                'span5',
                'span6',
            ]);
        });
    });
});
