import { constrainTests, setup } from '#cases/attributes/position/constrain.js';
import { expect, test } from '#test';

test.describe('QuerySet #constrain', () => {
    test.beforeEach(setup);

    constrainTests(([nodes, ...args]) => {
        $(nodes).constrain(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('[data-toggle="from"]');
            return query === query.constrain('[data-toggle="to"]');
        })).toBe(true);
    });

    test.describe('shadowed properties', () => {
        test('recalculates positions when the context root has a control named scrollHeight', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const form = document.createElement('form');
                form.style.cssText = 'display: flex; flex-direction: row; align-items: flex-start; margin: 0;';
                form.innerHTML =
                    '<input type="hidden" name="scrollHeight">' +
                    '<div id="test" style="flex-shrink: 0; width: 2000px; height: 2000px;"></div>' +
                    '<div id="container" style="flex-shrink: 0; width: 100px; height: 100px;"></div>';
                document.body.replaceChildren(form);
                const node = document.getElementById('test');
                const container = document.getElementById('container');
                // Use the form as the context root while retaining a normal HTML document for layout.
                $.setContext({
                    nodeType: Node.DOCUMENT_NODE,
                    documentElement: form,
                });
                $(node).constrain(container);
                return node.style.left;
            })).toBe('100px');
        });

        test('recalculates positions when the context root has a control named scrollWidth', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const form = document.createElement('form');
                form.style.cssText = 'display: flex; flex-direction: column; align-items: flex-start; margin: 0;';
                form.innerHTML =
                    '<input type="hidden" name="scrollWidth">' +
                    '<div id="test" style="flex-shrink: 0; width: 2000px; height: 2000px;"></div>' +
                    '<div id="container" style="flex-shrink: 0; width: 100px; height: 100px;"></div>';
                document.body.replaceChildren(form);
                const node = document.getElementById('test');
                const container = document.getElementById('container');
                // Use the form as the context root while retaining a normal HTML document for layout.
                $.setContext({
                    nodeType: Node.DOCUMENT_NODE,
                    documentElement: form,
                });
                $(node).constrain(container);
                return node.style.top;
            })).toBe('100px');
        });
    });

    test.describe('destination inputs', () => {
        test('works with HTMLElement other nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('[data-toggle="from"]').constrain(document.getElementById('test3'));
                return document.body.innerHTML;
            })).toBe('<div id="fromParent">' +
                '<div id="test1" data-toggle="from" style="display: block; width: 500px; height: 500px; left: 292px; top: 292px; position: relative;"></div>' +
                '<div id="test2" data-toggle="from" style="display: block; width: 500px; height: 500px; left: 292px; top: -208px; position: relative;"></div>' +
                '</div>' +
                '<div id="toParent">' +
                '<div id="test3" data-toggle="to" style="position: absolute; top: 300px; left: 300px; width: 500px; height: 500px;"></div>' +
                '<div data-togle="to"></div>' +
                '</div>');
        });

        test('works with NodeList other nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('[data-toggle="from"]').constrain(document.querySelectorAll('[data-toggle="to"]'));
                return document.body.innerHTML;
            })).toBe('<div id="fromParent">' +
                '<div id="test1" data-toggle="from" style="display: block; width: 500px; height: 500px; left: 292px; top: 292px; position: relative;"></div>' +
                '<div id="test2" data-toggle="from" style="display: block; width: 500px; height: 500px; left: 292px; top: -208px; position: relative;"></div>' +
                '</div>' +
                '<div id="toParent">' +
                '<div id="test3" data-toggle="to" style="position: absolute; top: 300px; left: 300px; width: 500px; height: 500px;"></div>' +
                '<div data-togle="to"></div>' +
                '</div>');
        });

        test('works with HTMLCollection other nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('[data-toggle="from"]').constrain(document.getElementById('toParent').children);
                return document.body.innerHTML;
            })).toBe('<div id="fromParent">' +
                '<div id="test1" data-toggle="from" style="display: block; width: 500px; height: 500px; left: 292px; top: 292px; position: relative;"></div>' +
                '<div id="test2" data-toggle="from" style="display: block; width: 500px; height: 500px; left: 292px; top: -208px; position: relative;"></div>' +
                '</div>' +
                '<div id="toParent">' +
                '<div id="test3" data-toggle="to" style="position: absolute; top: 300px; left: 300px; width: 500px; height: 500px;"></div>' +
                '<div data-togle="to"></div>' +
                '</div>');
        });

        test('works with array other nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('[data-toggle="from"]')
                        .constrain([
                            document.getElementById('test3'),
                            document.getElementById('test4'),
                        ]);
                return document.body.innerHTML;
            })).toBe('<div id="fromParent">' +
                '<div id="test1" data-toggle="from" style="display: block; width: 500px; height: 500px; left: 292px; top: 292px; position: relative;"></div>' +
                '<div id="test2" data-toggle="from" style="display: block; width: 500px; height: 500px; left: 292px; top: -208px; position: relative;"></div>' +
                '</div>' +
                '<div id="toParent">' +
                '<div id="test3" data-toggle="to" style="position: absolute; top: 300px; left: 300px; width: 500px; height: 500px;"></div>' +
                '<div data-togle="to"></div>' +
                '</div>');
        });

        test('works with QuerySet other nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const query = $('[data-toggle="to"]');
                $('[data-toggle="from"]').constrain(query);
                return document.body.innerHTML;
            })).toBe('<div id="fromParent">' +
                '<div id="test1" data-toggle="from" style="display: block; width: 500px; height: 500px; left: 292px; top: 292px; position: relative;"></div>' +
                '<div id="test2" data-toggle="from" style="display: block; width: 500px; height: 500px; left: 292px; top: -208px; position: relative;"></div>' +
                '</div>' +
                '<div id="toParent">' +
                '<div id="test3" data-toggle="to" style="position: absolute; top: 300px; left: 300px; width: 500px; height: 500px;"></div>' +
                '<div data-togle="to"></div>' +
                '</div>');
        });
    });
});
