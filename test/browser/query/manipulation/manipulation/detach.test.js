import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const DETACH_HTML =
    '<div id="parent1">' +
    '<a href="#" id="test1">Test</a>' +
    '<a href="#" id="test2">Test</a>' +
    '</div>' +
    '<div id="parent2">' +
    '<a href="#" id="test3">Test</a>' +
    '<a href="#" id="test4">Test</a>' +
    '</div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #detach', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, DETACH_HTML);
    });

    test('detaches all nodes from the DOM', async ({ page }) => {
        await page.evaluate(() => {
            $('a').detach();
        });

        await expect(page.locator('#parent1 > *')).toHaveCount(0);
        await expect(page.locator('#parent2 > *')).toHaveCount(0);
    });

    test('returns detached nodes', async ({ page }) => {
        const ids = await page.evaluate(() => $('a').detach().get().map((node) => node.id));

        expect(ids).toEqual([
            'test1',
            'test2',
            'test3',
            'test4',
        ]);
    });

    test('does not remove events', async ({ page }) => {
        const clickCount = await page.evaluate(() => {
            let count = 0;

            $.addEvent('a', 'click', () => {
                count++;
            });

            const nodes = $('a').detach().get();

            for (const node of nodes) {
                document.body.appendChild(node);
            }

            $.triggerEvent('a', 'click');

            return count;
        });

        expect(clickCount).toBe(4);
    });

    test('does not remove data', async ({ page }) => {
        const values = await page.evaluate(() => {
            $.setData('a', 'test', 'Test');

            const nodes = $('a').detach().get();

            for (const node of nodes) {
                document.body.appendChild(node);
            }

            return nodes.map((node) => $.getData(node, 'test'));
        });

        expect(values).toEqual([
            'Test',
            'Test',
            'Test',
            'Test',
        ]);
    });

    test('does not remove animations', async ({ page }) => {
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
            const nodes = $('a').detach().get();

            for (const node of nodes) {
                document.body.appendChild(node);
            }
        });

        await expect.poll(async () => await page.evaluate(() =>
            [...document.querySelectorAll('body > a')].length === 4 &&
            [...document.querySelectorAll('body > a')].every((node) => Boolean(node.dataset.animationProgress)),
        )).toBe(true);

        await expect.poll(async () => await page.evaluate(() =>
            [...document.querySelectorAll('body > a')].every((node) =>
                !node.dataset.animationProgress &&
                !node.dataset.animationStart &&
                !node.dataset.animationTime),
        )).toBe(true);
    });

    test('does not remove queue', async ({ page }) => {
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

        await expect.poll(async () => await page.locator('#test1').getAttribute('data-queue-state')).toBe('running');

        await page.evaluate(() => {
            const nodes = $('a').detach().get();

            for (const node of nodes) {
                document.body.appendChild(node);
            }
        });

        await expect.poll(async () => await page.locator('html').getAttribute('data-queue-checkpoint')).toBe('done');
        await expect(page.locator('#test1')).toHaveAttribute('data-test', 'Test');
        await expect(page.locator('#test2')).toHaveAttribute('data-test', 'Test');
        await expect(page.locator('#test3')).toHaveAttribute('data-test', 'Test');
        await expect(page.locator('#test4')).toHaveAttribute('data-test', 'Test');
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsSameQuery = await page.evaluate(() => {
            const query = $('a');

            return query === query.detach();
        });

        expect(returnsSameQuery).toBe(true);
    });
});
