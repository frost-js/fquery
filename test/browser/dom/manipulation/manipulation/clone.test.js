import { cloneTests, setup } from '#cases/manipulation/manipulation/clone.js';
import { expect, test } from '#test';

test.describe('#clone', () => {
    test.beforeEach(setup);

    cloneTests(() => $.clone);

    test.describe('event cloning', () => {
        test('preserves passive events on descendant nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.addEvent('.test1', 'test', () => false, { passive: true });

                const [clone] = $.clone('.parent1', { events: true });
                const event = new Event('test', { cancelable: true });

                clone.querySelector('.test1').dispatchEvent(event);

                return event.defaultPrevented;
            })).toBe(false);
        });
    });

    test.describe('node inputs', () => {
        test('clones forms with a control named cloneNode', async ({ page }) => {
            await page.evaluate(() => {
                document.body.innerHTML = '<form><input name="cloneNode"></form>';

                const clone = $.clone('form')[0];
                document.body.appendChild(clone);
            });

            await expect(page.locator('body > form')).toHaveCount(2);
            await expect(page.locator('body > form').nth(1).locator('input')).toHaveAttribute('name', 'cloneNode');
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
});
