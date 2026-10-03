import { expect, test } from '#test';

test.describe('#getSelection', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<div id="select">' +
                '<div id="div1">' +
                '<span id="span1">Test 1</span>' +
                '</div>' +
                '<div id="div2">' +
                '<span id="span2">Test 2</span>' +
                '</div>' +
                '</div>';

            const range = document.createRange();
            const span2 = document.getElementById('span2');
            range.setStartBefore(span2);
            range.setEnd(span2.firstChild, 3);

            const selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        });
    });

    test.describe('collapsed ranges', () => {
        for (const [name, createRange] of [
            ['before a lone descendant', () => {
                const range = document.createRange();
                range.setStartBefore(document.getElementById('span2'));
                return range;
            }],
            ['inside text', () => {
                const range = document.createRange();
                range.setStart(document.getElementById('span2').firstChild, 3);
                return range;
            }],
            ['inside an empty element', () => {
                const node = document.getElementById('span2');
                node.textContent = '';
                const range = document.createRange();
                range.selectNodeContents(node);
                return range;
            }],
        ]) {
            test(`returns no nodes for a collapsed range ${name}`, async ({ page }) => {
                const range = await page.evaluateHandle(createRange);

                expect(await range.evaluate((range) => {
                    range.collapse(true);

                    const selection = document.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);

                    const selected = $.getSelection();
                    document.body.innerHTML = '';
                    for (const node of selected) {
                        document.body.appendChild(node);
                    }
                    return document.body.innerHTML;
                })).toBe('');
            });
        }
    });

    test.describe('selected nodes', () => {
        test('returns the selected nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const selected = $.getSelection();
                document.body.innerHTML = '';
                for (const node of selected) {
                    document.body.appendChild(node);
                }
                return document.body.innerHTML;
            })).toBe('<span id="span2">Test 2</span>');
        });

        test('returns selected text and element siblings in order', async ({ page }) => {
            expect(await page.evaluate(() => {
                const node = document.getElementById('select');
                node.innerHTML = 'Test 1<span>Test 2</span>Test 3';
                const range = document.createRange();
                range.selectNodeContents(node);

                const selection = document.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                const selected = $.getSelection();
                document.body.innerHTML = '';
                for (const node of selected) {
                    document.body.appendChild(node);
                }
                return document.body.innerHTML;
            })).toBe('Test 1<span>Test 2</span>Test 3');
        });

        test('returns a selection contained in a text node', async ({ page }) => {
            expect(await page.evaluate(() => {
                const node = document.getElementById('span1').firstChild;
                const range = document.createRange();
                range.setStart(node, 1);
                range.setEnd(node, 3);

                const selection = document.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                const selected = $.getSelection();

                return [selected.length, selected[0].nodeType, selected[0].textContent];
            })).toEqual([1, 3, 'Test 1']);
        });

        test('does not extract the selected nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.getSelection();
                return document.body.innerHTML;
            })).toBe('<div id="select">' +
                '<div id="div1">' +
                '<span id="span1">Test 1</span>' +
                '</div>' +
                '<div id="div2">' +
                '<span id="span2">Test 2</span>' +
                '</div>' +
                '</div>');
        });
    });
});
