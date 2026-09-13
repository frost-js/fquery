/** @import { Page } from '@playwright/test'; */
/** @import { clone } from '../../../../src/manipulation/manipulation.js'; */

import { expect, test } from '#test';
import { advanceClock, setupClock } from '../../../setup/browser.js';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML =
            '<div class="parent1">' +
            '<a href="#" class="test1">Test</a>' +
            '<a href="#" class="test2">Test</a>' +
            '</div>' +
            '<div class="parent2">' +
            '<a href="#" class="test3">Test</a>' +
            '<a href="#" class="test4">Test</a>' +
            '</div>';
    });
};

/**
 * Registers shared clone behavior tests.
 * @param {() => typeof clone} createClone Creates the browser-side method adapter.
 */
export function cloneTests(createClone) {
    test('clones all nodes', async ({ page }) => {
        const operation = await page.evaluateHandle(createClone);

        const clones = await operation.evaluateHandle((operation, args) => operation(...args), ['div']);

        await clones.evaluate((clones) => {
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
        const operation = await page.evaluateHandle(createClone);

        const clones = await operation.evaluateHandle((operation, args) => operation(...args), ['div', { deep: false }]);

        await clones.evaluate((clones) => {
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

    test.describe('shallow template contents', () => {
        test('does not clone template content data with shallow option', async ({ page }) => {
            const operation = await page.evaluateHandle(createClone);

            const value = await page.evaluate((operation) => {
                const template = document.createElement('template');
                template.innerHTML = '<a>Test</a>';

                $.setData(template.content, 'test', 'Test');

                const [clone] = operation(template, { deep: false, data: true });

                return $.getData(clone.content, 'test');
            }, operation);

            expect(value).toBeUndefined();
        });
    });

    test.describe('event cloning', () => {
        test('clones all nodes with events', async ({ page }) => {
            const operation = await page.evaluateHandle(createClone);

            const clickCount = await page.evaluate((operation) => {
                let count = 0;

                $.addEvent('a', 'click', () => {
                    count++;
                });

                const clones = operation('a', { events: true });

                for (const clone of clones) {
                    document.body.appendChild(clone);
                }

                $.triggerEvent('a', 'click');

                return count;
            }, operation);

            expect(clickCount).toBe(8);
        });

        test('clones events inside template contents', async ({ page }) => {
            const operation = await page.evaluateHandle(createClone);

            const clickCount = await page.evaluate((operation) => {
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

                const [clone] = operation(template, { events: true });
                const nestedClone = clone.content.querySelector('template');

                $.triggerEvent(clone.content.querySelector('a'), 'click');
                $.triggerEvent(nestedClone.content.querySelector('a'), 'click');

                return count;
            }, operation);

            expect(clickCount).toBe(2);
        });
    });

    test.describe('data cloning', () => {
        test('clones all nodes with data', async ({ page }) => {
            const operation = await page.evaluateHandle(createClone);

            const values = await page.evaluate((operation) => {
                $.setData('a', 'test', 'Test');

                const clones = operation('a', { data: true });

                for (const clone of clones) {
                    document.body.appendChild(clone);
                }

                return [...document.querySelectorAll('a')].map((node) => $.getData(node, 'test'));
            }, operation);

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
            const operation = await page.evaluateHandle(createClone);

            const value = await page.evaluate((operation) => {
                document.body.innerHTML =
                    '<form><input name="childNodes"><span id="test">Test</span></form>';
                $.setData(document.getElementById('test'), 'test', 'Test');

                const clone = operation('form', { data: true })[0];

                return $.getData(clone.querySelector('span'), 'test');
            }, operation);

            expect(value).toBe('Test');
        });

        test('clones data with a __proto__ key', async ({ page }) => {
            const operation = await page.evaluateHandle(createClone);

            const value = await page.evaluate((operation) => {
                $.setData('.test1', '__proto__', 'Test');
                const [clone] = operation('.test1', { data: true });
                return $.getData(clone, '__proto__');
            }, operation);

            expect(value).toBe('Test');
        });

        test('does not return an inherited constructor from cloned data', async ({ page }) => {
            const operation = await page.evaluateHandle(createClone);

            const value = await page.evaluate((operation) => {
                $.setData('.test1', 'test', 'Test');
                const [clone] = operation('.test1', { data: true });
                return $.getData(clone, 'constructor') === undefined;
            }, operation);

            expect(value).toBe(true);
        });

        test('clones data inside template contents', async ({ page }) => {
            const operation = await page.evaluateHandle(createClone);

            const values = await page.evaluate((operation) => {
                const template = document.createElement('template');
                template.innerHTML = '<a>Test</a><template><a>Test</a></template>';
                const nested = template.content.querySelector('template');

                $.setData([
                    template.content,
                    template.content.querySelector('a'),
                    nested.content,
                    nested.content.querySelector('a'),
                ], 'test', 'Test');

                const [clone] = operation(template, { data: true });
                const nestedClone = clone.content.querySelector('template');

                return [
                    clone.content,
                    clone.content.querySelector('a'),
                    nestedClone.content,
                    nestedClone.content.querySelector('a'),
                ].map((node) => $.getData(node, 'test'));
            }, operation);

            expect(values).toEqual([
                'Test',
                'Test',
                'Test',
                'Test',
            ]);
        });
    });

    test.describe('animation cloning', () => {
        test('clones all nodes with animations', async ({ page }) => {
            const operation = await page.evaluateHandle(createClone);

            await setupClock(page);

            await page.evaluate((operation) => {
                $.animate(
                    'a',
                    () => {},
                    {
                        duration: 100,
                        debug: true,
                    },
                );

                const clones = operation('a', { animations: true });

                for (const clone of clones) {
                    document.body.appendChild(clone);
                }
            }, operation);

            await advanceClock(page, 20);

            expect(await page.evaluate(() => {
                const nodes = [...document.querySelectorAll('.parent1 > a, .parent2 > a, body > a')];

                return nodes.length === 8 &&
                    nodes.every((node) => Boolean(node.dataset.animationProgress));
            })).toBe(true);

            await advanceClock(page, 100);

            expect(await page.evaluate(() =>
                [...document.querySelectorAll('.parent1 > a, .parent2 > a, body > a')].every((node) =>
                    !node.dataset.animationProgress &&
                    !node.dataset.animationStart &&
                    !node.dataset.animationTime),
            )).toBe(true);
        });
    });
}
