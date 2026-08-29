import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = `
<div class="outer1">
    <div class="inner1">
        <a href="#">Test</a>
        <a href="#">Test</a>
    </div>
</div>
<div class="outer2">
    <div class="inner2">
        <a href="#">Test</a>
        <a href="#">Test</a>
    </div>
</div>
`;

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #replaceAll', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('replaces each other node with nodes', async ({ page }) => {
        await page.evaluate(() => {
            $('a').replaceAll('div');
        });

        await expect(page.locator('body > a')).toHaveCount(8);
        await expect(page.locator('body > div')).toHaveCount(0);
    });

    test('removes events from other nodes', async ({ page }) => {
        const clickCount = await page.evaluate(() => {
            let count = 0;
            const nodes = [...document.querySelectorAll('div')];

            $.addEvent('div', 'click', () => {
                count++;
            });

            $('a').replaceAll('div');

            for (const node of nodes) {
                node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            }

            return count;
        });

        expect(clickCount).toBe(0);
    });

    test('does not remove events for nodes', async ({ page }) => {
        const clickCount = await page.evaluate(() => {
            let count = 0;

            $.addEvent('a', 'click', () => {
                count++;
            });

            $('a').replaceAll('div');
            $.triggerEvent('a', 'click');

            return count;
        });

        expect(clickCount).toBe(8);
    });

    test('removes data from other nodes', async ({ page }) => {
        const values = await page.evaluate(() => {
            const nodes = [...document.querySelectorAll('div')];

            $.setData('div', 'test', 'Test');
            $('a').replaceAll('div');

            return nodes.map((node) => $.getData(node, 'test'));
        });

        expect(values).toEqual([undefined, undefined, undefined, undefined]);
    });

    test('does not remove data for nodes', async ({ page }) => {
        const values = await page.evaluate(() => {
            $.setData('a', 'test', 'Test');
            $('a').replaceAll('div');

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

    test('removes animations from other nodes', async ({ page }) => {
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

            $('a').replaceAll('div');

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

    test('does not remove animations for nodes', async ({ page }) => {
        await page.evaluate(() => {
            $.animate('a', () => {}, { duration: 100, debug: true });
            $('a').replaceAll('div');
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

    test('removes queue from other nodes', async ({ page }) => {
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

            $('a').replaceAll('div');

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

    test('triggers a remove event for other nodes', async ({ page }) => {
        const removeCount = await page.evaluate(() => {
            let count = 0;

            $.addEvent('div', 'remove', () => {
                count++;
            });

            $('a').replaceAll('div');

            return count;
        });

        expect(removeCount).toBe(4);
    });

    test('does not clone for the last nodes', async ({ page }) => {
        const isSameNode = await page.evaluate(() => {
            const nodes = [...document.querySelectorAll('a')];

            $('a').replaceAll('div');

            return nodes.every((node, index) =>
                node.isSameNode(document.querySelectorAll('body > a').item(index + 4)));
        });

        expect(isSameNode).toBe(true);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsSameQuery = await page.evaluate(() => {
            const query = $('a');

            return query === query.replaceAll('div');
        });

        expect(returnsSameQuery).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        await page.evaluate(() => {
            const fragment = document.createRange().createContextualFragment('<div><span></span></div>');

            $(fragment).replaceAll('a');
        });

        await expect(page.locator('a')).toHaveCount(0);
        await expect(page.locator('.inner1 > div > span')).toHaveCount(2);
        await expect(page.locator('.inner2 > div > span')).toHaveCount(2);
    });

    test('works with HTMLElement other nodes', async ({ page }) => {
        await page.evaluate(() => {
            $('a').replaceAll(document.querySelector('.inner2'));
        });

        await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
        await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
        await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
        await expect(page.locator('.outer2 > a')).toHaveCount(4);
    });

    test('works with NodeList other nodes', async ({ page }) => {
        await page.evaluate(() => {
            $('a').replaceAll(document.querySelectorAll('.inner2'));
        });

        await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
        await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
        await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
        await expect(page.locator('.outer2 > a')).toHaveCount(4);
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        await page.evaluate(() => {
            $('a').replaceAll(document.querySelector('.outer2').children);
        });

        await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
        await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
        await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
        await expect(page.locator('.outer2 > a')).toHaveCount(4);
    });

    test('works with array other nodes', async ({ page }) => {
        await page.evaluate(() => {
            $('a').replaceAll([document.querySelector('.inner2')]);
        });

        await expect(page.locator('.outer1 > .inner1')).toHaveCount(1);
        await expect(page.locator('.outer1 > .inner1 > a')).toHaveCount(0);
        await expect(page.locator('.outer2 > .inner2')).toHaveCount(0);
        await expect(page.locator('.outer2 > a')).toHaveCount(4);
    });

    test('works with QuerySet other nodes', async ({ page }) => {
        await page.evaluate(() => {
            $('a').replaceAll($('div'));
        });

        await expect(page.locator('body > a')).toHaveCount(8);
        await expect(page.locator('body > div')).toHaveCount(0);
    });
});
