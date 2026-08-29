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

test.describe('#clone', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, CLONE_HTML);
    });

    test('clones all nodes', async ({ page }) => {
        await page.evaluate(() => {
            const clones = $.clone('div');

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
            const clones = $.clone('div', { deep: false });

            for (const clone of clones) {
                document.body.appendChild(clone);
            }
        });

        await expect(page.locator('body > div')).toHaveCount(4);
        await expect(page.locator('body > div').nth(0).locator('a')).toHaveCount(2);
        await expect(page.locator('body > div').nth(1).locator('a')).toHaveCount(2);
        await expect(page.locator('body > div').nth(2).locator('a')).toHaveCount(0);
        await expect(page.locator('body > div').nth(3).locator('a')).toHaveCount(0);
    });

    test('clones all nodes with events', async ({ page }) => {
        const clickCount = await page.evaluate(() => {
            let count = 0;

            $.addEvent('a', 'click', () => {
                count++;
            });

            const clones = $.clone('a', { events: true });

            for (const clone of clones) {
                document.body.appendChild(clone);
            }

            $.triggerEvent('a', 'click');

            return count;
        });

        expect(clickCount).toBe(8);
    });

    test('preserves passive events on descendant nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.addEvent('.test1', 'test', (_) => false, { passive: true });

            const [clone] = $.clone('.parent1', { events: true });
            const event = new Event('test', { cancelable: true });

            clone.querySelector('.test1').dispatchEvent(event);

            return event.defaultPrevented;
        })).toBe(false);
    });

    test('clones all nodes with data', async ({ page }) => {
        const values = await page.evaluate(() => {
            $.setData('a', 'test', 'Test');

            const clones = $.clone('a', { data: true });

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

            const clones = $.clone('a', { animations: true });

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

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate(() => {
            const clones = $.clone(document.querySelector('.parent1'));

            for (const clone of clones) {
                document.body.appendChild(clone);
            }
        });

        await expect(page.locator('body > div')).toHaveCount(3);
        await expect(page.locator('body > div').nth(2)).toHaveClass('parent1');
        await expect(page.locator('body > div').nth(2).locator('a')).toHaveCount(2);
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate(() => {
            const clones = $.clone(document.querySelectorAll('div'));

            for (const clone of clones) {
                document.body.appendChild(clone);
            }
        });

        await expect(page.locator('body > div')).toHaveCount(4);
        await expect(page.locator('body > div').nth(2)).toHaveClass('parent1');
        await expect(page.locator('body > div').nth(3)).toHaveClass('parent2');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate(() => {
            const clones = $.clone(document.body.children, { deep: false });

            for (const clone of clones) {
                document.body.appendChild(clone);
            }
        });

        await expect(page.locator('body > div')).toHaveCount(4);
        await expect(page.locator('body > div').nth(2).locator('a')).toHaveCount(0);
        await expect(page.locator('body > div').nth(3).locator('a')).toHaveCount(0);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        await page.evaluate(() => {
            const fragment = document.createRange().createContextualFragment('<div><span></span></div>');
            const clones = $.clone(fragment);

            document.body.appendChild(fragment);

            for (const clone of clones) {
                document.body.appendChild(clone);
            }
        });

        await expect(page.locator('body > div')).toHaveCount(4);
        await expect(page.locator('body > div').nth(2).locator('span')).toHaveCount(1);
        await expect(page.locator('body > div').nth(3).locator('span')).toHaveCount(1);
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate(() => {
            const clones = $.clone([
                document.querySelector('.parent1'),
                document.querySelector('.parent2'),
            ]);

            for (const clone of clones) {
                document.body.appendChild(clone);
            }
        });

        await expect(page.locator('body > div')).toHaveCount(4);
        await expect(page.locator('body > div').nth(2)).toHaveClass('parent1');
        await expect(page.locator('body > div').nth(3)).toHaveClass('parent2');
    });
});
