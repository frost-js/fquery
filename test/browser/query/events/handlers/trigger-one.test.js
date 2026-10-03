import { setup, triggerOneTests } from '#cases/events/event-handlers/trigger-one.js';
import { expect, test } from '#test';

test.describe('QuerySet #triggerOne', () => {
    test.beforeEach(setup);

    triggerOneTests(([nodes, ...args]) => $(nodes).triggerOne(...args));

    test.describe('node inputs', () => {
        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                $.addEvent(shadow, 'click', () => {
                    result++;
                });
                $(shadow).triggerOne('click');
                return result;
            })).toBe(1);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                $.addEvent(document, 'click', () => {
                    result++;
                });
                $(document).triggerOne('click');
                return result;
            })).toBe(1);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                $.addEvent(window, 'click', () => {
                    result++;
                });
                $(window).triggerOne('click');
                return result;
            })).toBe(1);
        });
    });
});
