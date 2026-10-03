import { setStyleLockTests, setup } from '#cases/attributes/styles/set-style-lock.js';
import { expect, test } from '#test';

test.describe('QuerySet #setStyleLock', () => {
    test.beforeEach(setup);

    setStyleLockTests(([nodes, ...args]) => $(nodes).setStyleLock(...args));

    test.describe('release lifecycle', () => {
        test('releases duplicate nodes only once', async ({ page }) => {
            await page.evaluate(() => {
                const node = document.getElementById('test1');
                node.style.display = 'flex';
                const query = $('div').map(() => node);
                const release = query.setStyleLock('display', 'none');
                release();
            });

            await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
        });
    });

    test.describe('node inputs', () => {
        test('works with an empty selection', async ({ page }) => {
            expect(await page.evaluate(() => {
                const release = $('.missing').setStyleLock('display', 'none');
                release();
                return typeof release;
            })).toBe('function');
        });
    });
});
