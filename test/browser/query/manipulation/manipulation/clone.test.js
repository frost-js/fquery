import { expect, test } from '#test';

const CLONE_HTML =
    '<div class="parent1">' +
    '<a href="#" class="test1">Test</a>' +
    '<a href="#" class="test2">Test</a>' +
    '</div>' +
    '<div class="parent2">' +
    '<a href="#" class="test3">Test</a>' +
    '<a href="#" class="test4">Test</a>' +
    '</div>';

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

    test('clones forms with a control named cloneNode', async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML = '<form><input name="cloneNode"></form>';

            const clone = $('form').clone().get(0);
            document.body.appendChild(clone);
        });

        await expect(page.locator('body > form')).toHaveCount(2);
        await expect(page.locator('body > form').nth(1).locator('input')).toHaveAttribute('name', 'cloneNode');
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

    test('does not clone template content data with shallow option', async ({ page }) => {
        const value = await page.evaluate(() => {
            const template = document.createElement('template');
            template.innerHTML = '<a>Test</a>';

            $.setData(template.content, 'test', 'Test');

            const [clone] = $(template).clone({ deep: false, data: true }).get();

            return $.getData(clone.content, 'test');
        });

        expect(value).toBeUndefined();
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

    test('clones events inside template contents', async ({ page }) => {
        const clickCount = await page.evaluate(() => {
            let count = 0;
            const template = document.createElement('template');
            template.innerHTML = '<a>Test</a><template><a>Test</a></template>';
            const nested = template.content.querySelector('template');

            $.addEvent([
                template.content.querySelector('a'),
                nested.content.querySelector('a'),
            ], 'click', () => {
                count++;
            });

            const [clone] = $(template).clone({ events: true }).get();
            const nestedClone = clone.content.querySelector('template');

            $.triggerEvent(clone.content.querySelector('a'), 'click');
            $.triggerEvent(nestedClone.content.querySelector('a'), 'click');

            return count;
        });

        expect(clickCount).toBe(2);
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

    test('clones descendant data when a form control shadows childNodes', async ({ page }) => {
        const value = await page.evaluate(() => {
            document.body.innerHTML =
                '<form><input name="childNodes"><span id="test">Test</span></form>';
            $.setData(document.getElementById('test'), 'test', 'Test');

            const clone = $('form').clone({ data: true }).get(0);

            return $.getData(clone.querySelector('span'), 'test');
        });

        expect(value).toBe('Test');
    });

    test('clones data with a __proto__ key', async ({ page }) => {
        const value = await page.evaluate(() => {
            $.setData('.test1', '__proto__', 'Test');
            const [clone] = $('.test1').clone({ data: true }).get();
            return $.getData(clone, '__proto__');
        });

        expect(value).toBe('Test');
    });

    test('does not return an inherited constructor from cloned data', async ({ page }) => {
        const value = await page.evaluate(() => {
            $.setData('.test1', 'test', 'Test');
            const [clone] = $('.test1').clone({ data: true }).get();
            return $.getData(clone, 'constructor') === undefined;
        });

        expect(value).toBe(true);
    });

    test('clones data inside template contents', async ({ page }) => {
        const values = await page.evaluate(() => {
            const template = document.createElement('template');
            template.innerHTML = '<a>Test</a><template><a>Test</a></template>';
            const nested = template.content.querySelector('template');

            $.setData([
                template.content,
                template.content.querySelector('a'),
                nested.content,
                nested.content.querySelector('a'),
            ], 'test', 'Test');

            const [clone] = $(template).clone({ data: true }).get();
            const nestedClone = clone.content.querySelector('template');

            return [
                clone.content,
                clone.content.querySelector('a'),
                nestedClone.content,
                nestedClone.content.querySelector('a'),
            ].map((node) => $.getData(node, 'test'));
        });

        expect(values).toEqual([
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
