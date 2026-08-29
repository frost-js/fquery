import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const CLONE_HTML =
    '<div class="parent1">' +
    '<a href="#" class="test1">Test</a>' +
    '<a href="#" class="test2">Test</a>' +
    '</div>' +
    '<div class="parent2">' +
    '<a href="#" class="test3">Test</a>' +
    '<a href="#" class="test4">Test</a>' +
    '</div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #clone', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, CLONE_HTML);
    });

    test('clones all nodes', async ({ page }) => {
        await page.evaluate(() => {
            const clones = $('div').clone().get();

            for (const clone of clones) {
                document.body.appendChild(clone);
            }
        });

        await expect(page.locator('body > div')).toHaveCount(4);
        await expect(page.locator('body > div').nth(2)).toHaveClass('parent1');
        await expect(page.locator('body > div').nth(3)).toHaveClass('parent2');
        await expect(page.locator('body > div').nth(2).locator('a')).toHaveCount(2);
        await expect(page.locator('body > div').nth(3).locator('a')).toHaveCount(2);
    });

    test('shallow clones all nodes', async ({ page }) => {
        await page.evaluate(() => {
            const clones = $('div').clone({ deep: false }).get();

            for (const clone of clones) {
                document.body.appendChild(clone);
            }
        });

        await expect(page.locator('body > div')).toHaveCount(4);
        await expect(page.locator('body > div').nth(2).locator('a')).toHaveCount(0);
        await expect(page.locator('body > div').nth(3).locator('a')).toHaveCount(0);
    });

    test('clones all nodes with events', async ({ page }) => {
        const clickCount = await page.evaluate(() => {
            let count = 0;

            $.addEvent('a', 'click', () => {
                count++;
            });

            const clones = $('a').clone({ events: true }).get();

            for (const clone of clones) {
                document.body.appendChild(clone);
            }

            $.triggerEvent('a', 'click');

            return count;
        });

        expect(clickCount).toBe(8);
    });

    test('clones all nodes with data', async ({ page }) => {
        const values = await page.evaluate(() => {
            $.setData('a', 'test', 'Test');

            const clones = $('a').clone({ data: true }).get();

            for (const clone of clones) {
                document.body.appendChild(clone);
            }

            return [...document.querySelectorAll('a')].map((node) => $.getData(node, 'test'));
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

    test('clones all nodes with animations', async ({ page }) => {
        await page.evaluate(() => {
            $.animate(
                'a',
                () => {},
                {
                    duration: 100,
                    debug: true,
                },
            );

            const clones = $('a').clone({ animations: true }).get();

            for (const clone of clones) {
                document.body.appendChild(clone);
            }
        });

        await expect.poll(async () => await page.evaluate(() => {
            const nodes = [...document.querySelectorAll('.parent1 > a, .parent2 > a, body > a')];

            return nodes.length === 8 &&
                nodes.every((node) => Boolean(node.dataset.animationProgress));
        })).toBe(true);

        await expect.poll(async () => await page.evaluate(() =>
            [...document.querySelectorAll('.parent1 > a, .parent2 > a, body > a')].every((node) =>
                !node.dataset.animationProgress &&
                !node.dataset.animationStart &&
                !node.dataset.animationTime),
        )).toBe(true);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const rootQuery = $('div');
            const cloneQuery = rootQuery.clone();

            return cloneQuery.constructor.name === 'QuerySet' && rootQuery !== cloneQuery;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        await page.evaluate(() => {
            const fragment = document.createRange().createContextualFragment('<div><span></span></div>');
            const clones = $(fragment).clone().get();

            document.body.appendChild(fragment);

            for (const clone of clones) {
                document.body.appendChild(clone);
            }
        });

        await expect(page.locator('body > div')).toHaveCount(4);
        await expect(page.locator('body > div').nth(2).locator('span')).toHaveCount(1);
        await expect(page.locator('body > div').nth(3).locator('span')).toHaveCount(1);
    });
});
