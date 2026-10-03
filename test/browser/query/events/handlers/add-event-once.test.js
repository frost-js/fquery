import { addEventOnceTests, setup } from '#cases/events/event-handlers/add-event-once.js';
import { expect, test } from '#test';

test.describe('QuerySet #addEventOnce', () => {
    test.beforeEach(setup);

    addEventOnceTests(() => (nodes, ...args) => {
        $(nodes).addEventOnce(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query = $('a');
            return query === query.addEventOnce('click', () => null);
        })).toBe(true);
    });

    test.describe('node inputs', () => {
        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click');
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                $(shadow)
                        .addEventOnce('click', () => {
                            result++;
                        });
                shadow.dispatchEvent(event);
                shadow.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click');
                $(document)
                        .addEventOnce('click', () => {
                            result++;
                        });
                document.dispatchEvent(event);
                document.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click');
                $(window)
                        .addEventOnce('click', () => {
                            result++;
                        });
                window.dispatchEvent(event);
                window.dispatchEvent(event);
                return result;
            })).toBe(1);
        });
    });
});
