import { replaceWithTests, setup } from '#cases/manipulation/manipulation/replace-with.js';
import { expect, test } from '#test';

test.describe('QuerySet #replaceWith', () => {
    test.beforeEach(setup);

    replaceWithTests(([nodes, ...args]) => {
        $(nodes).replaceWith(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsSameQuery = await page.evaluate(() => {
            const query = $('div');

            return query === query.replaceWith('a');
        });

        expect(returnsSameQuery).toBe(true);
    });

    test.describe('replacement placement', () => {
        test('inserts the original replacement when the final target is detached', async ({ page }) => {
            const isOriginal = await page.evaluate(() => {
                const node = document.querySelector('.outer1');
                const detached = document.createElement('div');
                const replacement = document.querySelector('.inner2 a');

                $([node, detached]).replaceWith(replacement);

                return document.body.firstElementChild === replacement;
            });

            expect(isOriginal).toBe(true);
            await expect(page.locator('.outer1')).toHaveCount(0);
        });

        test('does not clone for the last other nodes', async ({ page }) => {
            const isSameNode = await page.evaluate(() => {
                const nodes = [...document.querySelectorAll('a')];

                $('div').replaceWith('a');

                return nodes.every((node, index) =>
                    node.isSameNode(document.querySelectorAll('body > a').item(index + 4)));
            });

            expect(isSameNode).toBe(true);
        });
    });

    test.describe('unchanged replacements', () => {
        test('does not move replacement nodes when the target set is empty', async ({ page }) => {
            const isSamePosition = await page.evaluate(() => {
                const node = document.querySelector('.inner1 a');
                const { parentNode, previousSibling, nextSibling } = node;

                $([]).replaceWith(node);

                return node.parentNode === parentNode &&
                    node.previousSibling === previousSibling &&
                    node.nextSibling === nextSibling;
            });

            expect(isSamePosition).toBe(true);
        });

        test('does not move a node when replacing it with itself', async ({ page }) => {
            const isSamePosition = await page.evaluate(() => {
                const node = document.querySelector('.inner1 a');
                const { parentNode, previousSibling, nextSibling } = node;

                $(node).replaceWith(node);

                return node.parentNode === parentNode &&
                    node.previousSibling === previousSibling &&
                    node.nextSibling === nextSibling;
            });

            expect(isSamePosition).toBe(true);
        });

        test('does not move a node when targets include itself and its descendant', async ({ page }) => {
            const isSamePosition = await page.evaluate(() => {
                const node = document.querySelector('.outer1');
                const child = node.querySelector('.inner1');
                const { parentNode, previousSibling, nextSibling } = node;

                $([node, child]).replaceWith(node);

                return node.parentNode === parentNode &&
                    node.previousSibling === previousSibling &&
                    node.nextSibling === nextSibling &&
                    child.parentNode === node;
            });

            expect(isSamePosition).toBe(true);
        });
    });

    test.describe('cleanup', () => {
        test('removes events from nodes', async ({ page }) => {
            const clickCount = await page.evaluate(() => {
                let count = 0;
                const nodes = [...document.querySelectorAll('div')];

                $.addEvent('div', 'click', () => {
                    count++;
                });

                $('div').replaceWith('a');

                for (const node of nodes) {
                    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                }

                return count;
            });

            expect(clickCount).toBe(0);
        });

        test('does not remove events for other nodes', async ({ page }) => {
            const clickCount = await page.evaluate(() => {
                let count = 0;

                $.addEvent('a', 'click', () => {
                    count++;
                });

                $('div').replaceWith('a');
                $.triggerEvent('a', 'click');

                return count;
            });

            expect(clickCount).toBe(8);
        });

        test('removes data from nodes', async ({ page }) => {
            const values = await page.evaluate(() => {
                const nodes = [...document.querySelectorAll('div')];

                $.setData('div', 'test', 'Test');
                $('div').replaceWith('a');

                return nodes.map((node) => $.getData(node, 'test'));
            });

            expect(values).toEqual([undefined, undefined, undefined, undefined]);
        });

        test('does not remove data for other nodes', async ({ page }) => {
            const values = await page.evaluate(() => {
                $.setData('a', 'test', 'Test');
                $('div').replaceWith('a');

                return [...document.querySelectorAll('body > a')].map((node) => $.getData(node, 'test'));
            });

            expect(values).toEqual([
                'Test',
                'Test',
                'Test',
                'Test',
                'Test',
                'Test',
                'Test',
                'Test',
            ]);
        });

        test('removes animations from nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.animate('div', () => {}, { duration: 100, debug: true });
            });

            await expect.poll(async () =>
                await page.evaluate(() =>
                    ['.outer1', '.inner1', '.outer2', '.inner2'].every((selector) =>
                        Boolean(document.querySelector(selector)?.dataset.animationProgress)),
                )).toBe(true);

            await page.evaluate(() => {
                const nodes = [...document.querySelectorAll('div')];

                $('div').replaceWith('a');

                for (const node of nodes) {
                    document.body.appendChild(node);
                }
            });

            await expect.poll(async () =>
                await page.evaluate(() =>
                    ['.outer1', '.inner1', '.outer2', '.inner2'].every((selector) => {
                        const node = document.querySelector(selector);

                        return Boolean(node) &&
                            !node.dataset.animationProgress &&
                            !node.dataset.animationStart &&
                            !node.dataset.animationTime;
                    }),
                )).toBe(true);
        });

        test('does not remove animations for other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.animate('a', () => {}, { duration: 100, debug: true });
                $('div').replaceWith('a');
            });

            await expect.poll(async () =>
                await page.evaluate(() =>
                    [...document.querySelectorAll('body > a')].every((node) => Boolean(node.dataset.animationProgress)),
                )).toBe(true);

            await expect.poll(async () =>
                await page.evaluate(() =>
                    [...document.querySelectorAll('body > a')].every((node) =>
                        !node.dataset.animationProgress &&
                        !node.dataset.animationStart &&
                        !node.dataset.animationTime),
                )).toBe(true);
        });

        test('removes queue from nodes', async ({ page }) => {
            await page.evaluate(async () => {
                const nodes = [...document.querySelectorAll('div')];
                const queueResolvers = [];
                let resolveAllStarted;
                const allStarted = new Promise((resolve) => {
                    resolveAllStarted = resolve;
                });

                $.queue('div', () => new Promise((resolve) => {
                    queueResolvers.push(resolve);

                    if (queueResolvers.length === nodes.length) {
                        resolveAllStarted();
                    }
                }));

                $.queue('div', (node) => {
                    node.dataset.test = 'Test';
                });

                await allStarted;

                $('div').replaceWith('a');

                for (const node of nodes) {
                    document.body.appendChild(node);
                }

                queueResolvers.forEach((resolve) => {
                    resolve();
                });

                await new Promise((resolve) => {
                    setTimeout(resolve, 0);
                });
            });

            await expect(page.locator('body > a')).toHaveCount(8);
            await expect(page.locator('body > div')).toHaveCount(4);
            expect(await page.locator('.outer1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('.inner1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('.outer2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('.inner2').getAttribute('data-test')).toBeNull();
        });
    });

    test.describe('removal events', () => {
        test('triggers a remove event for nodes', async ({ page }) => {
            const removeCount = await page.evaluate(() => {
                let count = 0;

                $.addEvent('div', 'remove', () => {
                    count++;
                });

                $('div').replaceWith('a');

                return count;
            });

            expect(removeCount).toBe(4);
        });
    });

    test.describe('replacement inputs', () => {
        test('works with HTMLElement other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('div').replaceWith(document.querySelector('.inner1'));
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with NodeList other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('div').replaceWith(document.querySelectorAll('.inner1'));
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with HTMLCollection other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('div').replaceWith(document.querySelector('.outer1').children);
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with DocumentFragment other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('a').replaceWith(document.createRange().createContextualFragment('<div><span></span></div>'));
            });

            await expect(page.locator('a')).toHaveCount(0);
            await expect(page.locator('.inner1 > div > span')).toHaveCount(2);
            await expect(page.locator('.inner2 > div > span')).toHaveCount(2);
        });

        test('works with array other nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('div').replaceWith([document.querySelector('.inner1')]);
            });

            await expect(page.locator('body > .inner1')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(0).locator('a')).toHaveCount(2);
            await expect(page.locator('body > .inner1').nth(1).locator('a')).toHaveCount(2);
        });

        test('works with QuerySet other nodes', async ({ page }) => {
            await page.evaluate(() => {
                const query = $('a');

                $('div').replaceWith(query);
            });

            await expect(page.locator('body > a')).toHaveCount(8);
            await expect(page.locator('body > div')).toHaveCount(0);
        });
    });
});
