import { expect, test } from '#test';

test.describe('#debounce', () => {
    test('unlocks when the callback throws', async ({ page }) => {
        expect(await page.evaluate(async () => {
            window.addEventListener('unhandledrejection', (event) => {
                event.preventDefault();
            }, { once: true });

            let calls = 0;
            const callback = $.debounce(() => {
                calls++;

                if (calls === 1) {
                    throw new Error('Test error');
                }
            });

            callback();
            await Promise.resolve();
            callback();
            await Promise.resolve();

            return calls;
        })).toBe(2);
    });
});
