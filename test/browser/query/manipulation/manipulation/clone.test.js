import { cloneTests, setup } from '#cases/manipulation/manipulation/clone.js';
import { expect, test } from '#test';

test.describe('QuerySet #clone', () => {
    test.beforeEach(setup);

    cloneTests(() => (nodes, ...args) => $(nodes).clone(...args).get());

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const rootQuery = $('div');
            const cloneQuery = rootQuery.clone();

            return cloneQuery.constructor.name === 'QuerySet' && rootQuery !== cloneQuery;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('node inputs', () => {
        test('clones forms with a control named cloneNode', async ({ page }) => {
            await page.evaluate(() => {
                document.body.innerHTML = '<form><input name="cloneNode"></form>';

                const clone = $('form').clone().get(0);
                document.body.appendChild(clone);
            });

            await expect(page.locator('body > form')).toHaveCount(2);
            await expect(page.locator('body > form').nth(1).locator('input')).toHaveAttribute('name', 'cloneNode');
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
});
