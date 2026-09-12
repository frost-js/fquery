import { removeTests, setup } from '#cases/manipulation/manipulation/remove.js';
import { expect, test } from '#test';
import { advanceClock, setupClock } from '../../../../setup/browser.js';

test.describe('QuerySet #remove', () => {
    test.beforeEach(setup);

    removeTests(([nodes, ...args]) => {
        $(nodes).remove(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsSameQuery = await page.evaluate(() => {
            const query = $('a');

            return query === query.remove();
        });

        expect(returnsSameQuery).toBe(true);
    });

    test.describe('cleanup', () => {
        test('removes events', async ({ page }) => {
            const clickCount = await page.evaluate(() => {
                let count = 0;
                const nodes = [...document.querySelectorAll('a')];

                $.addEvent('a', 'click', () => {
                    count++;
                });

                $('a').remove();

                for (const node of nodes) {
                    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                }

                return count;
            });

            expect(clickCount).toBe(0);
        });

        test('removes events recursively', async ({ page }) => {
            const clickCount = await page.evaluate(() => {
                let count = 0;
                const nodes = [...document.querySelectorAll('a')];

                $.addEvent('a', 'click', () => {
                    count++;
                });

                $('div').remove();

                for (const node of nodes) {
                    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                }

                return count;
            });

            expect(clickCount).toBe(0);
        });

        test('removes data', async ({ page }) => {
            const values = await page.evaluate(() => {
                const nodes = [...document.querySelectorAll('a')];

                $.setData('a', 'test', 'Test');
                $('a').remove();

                return nodes.map((node) => $.getData(node, 'test'));
            });

            expect(values).toEqual([
                undefined,
                undefined,
                undefined,
                undefined,
            ]);
        });

        test('removes descendant data when a form control shadows children', async ({ page }) => {
            const value = await page.evaluate(() => {
                document.body.innerHTML =
                    '<form>' +
                    '<input name="children">' +
                    '<span id="test">Test</span>' +
                    '</form>';
                const child = document.getElementById('test');
                $.setData(child, 'test', 'Test');

                $('form').remove();

                return $.getData(child, 'test');
            });

            expect(value).toBeUndefined();
        });

        test('removes descendant data when a form control shadows shadowRoot', async ({ page }) => {
            const value = await page.evaluate(() => {
                document.body.innerHTML =
                    '<form>' +
                    '<input name="shadowRoot">' +
                    '<span id="test">Test</span>' +
                    '</form>';
                const child = document.getElementById('test');
                $.setData(child, 'test', 'Test');

                $('form').remove();

                return $.getData(child, 'test');
            });

            expect(value).toBeUndefined();
        });

        test('removes data recursively', async ({ page }) => {
            const values = await page.evaluate(() => {
                const nodes = [...document.querySelectorAll('a')];

                $.setData('a', 'test', 'Test');
                $('div').remove();

                return nodes.map((node) => $.getData(node, 'test'));
            });

            expect(values).toEqual([
                undefined,
                undefined,
                undefined,
                undefined,
            ]);
        });

        test('removes animations', async ({ page }) => {
            await page.evaluate(() => {
                $.animate(
                    'a',
                    () => {},
                    {
                        duration: 100,
                        debug: true,
                    },
                );
            });

            await expect.poll(async () => await page.evaluate(() =>
                [...document.querySelectorAll('a')].length === 4 &&
                [...document.querySelectorAll('a')].every((node) => Boolean(node.dataset.animationProgress)),
            )).toBe(true);

            await page.evaluate(() => {
                const nodes = [...document.querySelectorAll('a')];

                $('a').remove();

                for (const node of nodes) {
                    document.body.appendChild(node);
                }
            });

            await expect.poll(async () => await page.evaluate(() =>
                [...document.querySelectorAll('body > a')].every((node) =>
                    !node.dataset.animationProgress &&
                    !node.dataset.animationStart &&
                    !node.dataset.animationTime),
            )).toBe(true);
        });

        test('removes animations recursively', async ({ page }) => {
            await page.evaluate(() => {
                $.animate(
                    'a',
                    () => {},
                    {
                        duration: 100,
                        debug: true,
                    },
                );
            });

            await expect.poll(async () => await page.evaluate(() =>
                [...document.querySelectorAll('a')].length === 4 &&
                [...document.querySelectorAll('a')].every((node) => Boolean(node.dataset.animationProgress)),
            )).toBe(true);

            await page.evaluate(() => {
                const nodes = [...document.querySelectorAll('a')];

                $('div').remove();

                for (const node of nodes) {
                    document.body.appendChild(node);
                }
            });

            await expect.poll(async () => await page.evaluate(() =>
                [...document.querySelectorAll('body > a')].every((node) =>
                    !node.dataset.animationProgress &&
                    !node.dataset.animationStart &&
                    !node.dataset.animationTime),
            )).toBe(true);
        });

        test('removes queue', async ({ page }) => {
            await setupClock(page);

            await page.evaluate(() => {
                document.documentElement.removeAttribute('data-queue-checkpoint');

                setTimeout(() => {
                    document.documentElement.setAttribute('data-queue-checkpoint', 'done');
                }, 110);

                $.queue('a', (node) => {
                    node.dataset.queueState = 'running';

                    return new Promise((resolve) => {
                        setTimeout(resolve, 100);
                    });
                });
                $.queue('a', (node) => {
                    node.dataset.test = 'Test';
                });
            });

            await advanceClock(page, 10);
            await expect.poll(async () => await page.locator('#test1').getAttribute('data-queue-state')).toBe('running');

            await page.evaluate(() => {
                const nodes = [...document.querySelectorAll('a')];

                $('a').remove();

                for (const node of nodes) {
                    document.body.appendChild(node);
                }
            });

            await advanceClock(page, 120);
            await expect(page.locator('html')).toHaveAttribute('data-queue-checkpoint', 'done');
            expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();
        });

        test('removes queue recursively', async ({ page }) => {
            await setupClock(page);

            await page.evaluate(() => {
                document.documentElement.removeAttribute('data-queue-checkpoint');

                setTimeout(() => {
                    document.documentElement.setAttribute('data-queue-checkpoint', 'done');
                }, 110);

                $.queue('a', (node) => {
                    node.dataset.queueState = 'running';

                    return new Promise((resolve) => {
                        setTimeout(resolve, 100);
                    });
                });
                $.queue('a', (node) => {
                    node.dataset.test = 'Test';
                });
            });

            await advanceClock(page, 10);
            await expect.poll(async () => await page.locator('#test1').getAttribute('data-queue-state')).toBe('running');

            await page.evaluate(() => {
                const nodes = [...document.querySelectorAll('a')];

                $('div').remove();

                for (const node of nodes) {
                    document.body.appendChild(node);
                }
            });

            await advanceClock(page, 120);
            await expect(page.locator('html')).toHaveAttribute('data-queue-checkpoint', 'done');
            expect(await page.locator('#test1').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test3').getAttribute('data-test')).toBeNull();
            expect(await page.locator('#test4').getAttribute('data-test')).toBeNull();
        });
    });

    test.describe('removal events', () => {
        test('triggers a remove event', async ({ page }) => {
            const removeCount = await page.evaluate(() => {
                let count = 0;

                $.addEvent('a', 'remove', () => {
                    count++;
                });

                $('a').remove();

                return count;
            });

            expect(removeCount).toBe(4);
        });

        test('triggers a remove event recursively', async ({ page }) => {
            const removeCount = await page.evaluate(() => {
                let count = 0;

                $.addEvent('a', 'remove', () => {
                    count++;
                });

                $('div').remove();

                return count;
            });

            expect(removeCount).toBe(4);
        });
    });

    test.describe('node inputs', () => {
        test('removes meta nodes with a content attribute', async ({ page }) => {
            await page.evaluate(() => {
                document.head.innerHTML = '<meta name="description" content="Test 1">';

                $('meta').remove();
            });

            await expect(page.locator('head > meta')).toHaveCount(0);
        });

        test('removes forms with a control named remove', async ({ page }) => {
            await page.evaluate(() => {
                document.body.innerHTML = '<form><input name="remove"></form>';

                $('form').remove();
            });

            await expect(page.locator('form')).toHaveCount(0);
        });
    });
});
