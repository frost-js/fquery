import { expect, test } from '#test';
import { advanceClock, resetPage, setupClock } from '../../../../setup/browser.js';

const NESTED_HTML =
    '<div id="outer1">' +
    '<div id="inner1">' +
    '<a href="#" id="test1">Test</a>' +
    '<a href="#" id="test2">Test</a>' +
    '</div>' +
    '</div>' +
    '<div id="outer2">' +
    '<div id="inner2">' +
    '<a href="#" id="test3">Test</a>' +
    '<a href="#" id="test4">Test</a>' +
    '</div>' +
    '</div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#empty', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, NESTED_HTML);
    });

    test('removes contents of all nodes from the DOM', async ({ page }) => {
        await page.evaluate(() => {
            $.empty('div');
        });

        await expect(page.locator('body > div')).toHaveCount(2);
        await expect(page.locator('#outer1 > *')).toHaveCount(0);
        await expect(page.locator('#outer2 > *')).toHaveCount(0);
        await expect(page.locator('a')).toHaveCount(0);
    });

    test('removes events recursively', async ({ page }) => {
        const clickCount = await page.evaluate(() => {
            let count = 0;
            const nodes = [...document.querySelectorAll('a')];

            $.addEvent('a', 'click', () => {
                count++;
            });

            $.empty('div');

            for (const node of nodes) {
                node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            }

            return count;
        });

        expect(clickCount).toBe(0);
    });

    test('removes data recursively', async ({ page }) => {
        const values = await page.evaluate(() => {
            const nodes = [...document.querySelectorAll('a')];

            $.setData('a', 'test', 'Test');
            $.empty('div');

            return nodes.map((node) => $.getData(node, 'test'));
        });

        expect(values).toEqual([
            undefined,
            undefined,
            undefined,
            undefined,
        ]);
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

            $.empty('div');

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

            $.empty('div');

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

    test('triggers a remove event recursively', async ({ page }) => {
        const removeCount = await page.evaluate(() => {
            let count = 0;

            $.addEvent('a', 'remove', () => {
                count++;
            });

            $.empty('div');

            return count;
        });

        expect(removeCount).toBe(4);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const result = await page.evaluate(() => {
            $.empty(document.getElementById('outer1'));

            return {
                bodyChildren: document.body.children.length,
                outer1Children: document.getElementById('outer1').children.length,
                outer2Children: document.getElementById('outer2').children.length,
            };
        });

        expect(result).toEqual({
            bodyChildren: 2,
            outer1Children: 0,
            outer2Children: 1,
        });

        await expect(page.locator('#test3')).toHaveCount(1);
        await expect(page.locator('#test4')).toHaveCount(1);
    });

    test('works with NodeList nodes', async ({ page }) => {
        const result = await page.evaluate(() => {
            $.empty(document.querySelectorAll('div'));

            return {
                bodyChildren: document.body.children.length,
                outer1Children: document.getElementById('outer1').children.length,
                outer2Children: document.getElementById('outer2').children.length,
            };
        });

        expect(result).toEqual({
            bodyChildren: 2,
            outer1Children: 0,
            outer2Children: 0,
        });
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const result = await page.evaluate(() => {
            $.empty(document.body.children);

            return {
                bodyChildren: document.body.children.length,
                outer1Children: document.getElementById('outer1').children.length,
                outer2Children: document.getElementById('outer2').children.length,
            };
        });

        expect(result).toEqual({
            bodyChildren: 2,
            outer1Children: 0,
            outer2Children: 0,
        });
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const result = await page.evaluate(() => {
            const fragment = document.createRange().createContextualFragment('<div><span></span></div>');

            $.empty(fragment);

            return {
                childNodes: fragment.childNodes.length,
                firstChildChildren: fragment.firstChild?.childNodes.length ?? null,
            };
        });

        expect(result).toEqual({
            childNodes: 0,
            firstChildChildren: null,
        });
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const shadowHtml = await page.evaluate(() => {
            const host = document.createElement('div');
            const shadow = host.attachShadow({ mode: 'open' });

            shadow.appendChild(document.createRange().createContextualFragment('<div><span></span></div>'));
            $.empty(shadow);

            return shadow.innerHTML;
        });

        expect(shadowHtml).toBe('');
    });

    test('works with Document nodes', async ({ page }) => {
        const childNodeCount = await page.evaluate(() => {
            const doc = new DOMParser().parseFromString('<html></html>', 'text/html');

            $.empty(doc);

            return doc.childNodes.length;
        });

        expect(childNodeCount).toBe(0);
    });

    test('works with array nodes', async ({ page }) => {
        const result = await page.evaluate(() => {
            $.empty([
                document.getElementById('outer1'),
                document.getElementById('outer2'),
            ]);

            return {
                bodyChildren: document.body.children.length,
                outer1Children: document.getElementById('outer1').children.length,
                outer2Children: document.getElementById('outer2').children.length,
            };
        });

        expect(result).toEqual({
            bodyChildren: 2,
            outer1Children: 0,
            outer2Children: 0,
        });
    });
});
