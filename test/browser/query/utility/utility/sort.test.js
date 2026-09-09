import { expect, test } from '#test';

test.describe('QuerySet #sort', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('returns nodes sorted by the order they appear in the DOM', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const template = document.createElement('template');
            const fragment = template.content;
            fragment.id = 'fragment';
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            shadow.id = 'shadow';
            document.body.insertBefore(template, document.body.firstChild);
            document.body.insertBefore(div, document.body.firstChild);
            return $([
                fragment,
                document.getElementById('div3'),
                document.getElementById('div4'),
                document.getElementById('div2'),
                document.getElementById('div1'),
                shadow,
                document,
                window,
            ]).sort().get().map((node) => node.id);
        })).toEqual([
            'fragment',
            'shadow',
            'div1',
            'div2',
            'div3',
            'div4',
            'document',
            'window',
        ]);
    });

    test('sorts reversed nodes within a detached tree', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const parent = document.createElement('div');
            const node1 = document.getElementById('div1');
            const node2 = document.getElementById('div2');

            parent.appendChild(node1);
            parent.appendChild(node2);

            return $([node2, node1]).sort().get().map((node) => node.id);
        })).toEqual([
            'div1',
            'div2',
        ]);
    });

    test('preserves the order of nodes in separate detached trees', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node1 = document.getElementById('div1');
            const node2 = document.getElementById('div2');

            node1.remove();
            node2.remove();

            return $([node2, node1]).sort().get().map((node) => node.id);
        })).toEqual([
            'div2',
            'div1',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.sort();
            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        })).toEqual(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            fragment.id = 'fragment';
            return $(fragment)
                    .sort()
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
            return $(shadow)
                    .sort()
                    .get()
                    .map((node) => node.id);
        })).toEqual([
            'shadow',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(document)
                    .sort()
                    .get()
                    .map((node) => node.id))).toEqual([
            'document',
        ]);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(window)
                    .sort()
                    .get()
                    .map((node) => node.id))).toEqual([
            'window',
        ]);
    });
});
